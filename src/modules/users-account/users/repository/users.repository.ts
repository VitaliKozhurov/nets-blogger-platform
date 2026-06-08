import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource, Repository } from 'typeorm';
import {
  IPasswordRecoveryEntityDto,
  IUserConfirmationEntityDto,
  IUserEntityDto,
} from '../domain/dto';
import { CreateUserDto } from './dto/create-user.params.dto';
import { UserEntity } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  async save(user: UserEntity) {
    await this.usersRepo.save(user);
  }

  async findById(id: string): Promise<IUserEntityDto | null> {
    const [user]: IUserEntityDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE users.id = $1 AND "deletedAt" IS NULL
      `,
      [id]
    );

    return user || null;
  }

  async findByIdOrThrow(id: string): Promise<IUserEntityDto> {
    const user = await this.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'User not found',
      });
    }

    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<IUserEntityDto | null> {
    const [user]: IUserEntityDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE (users.login = $1 OR users.email = $1) AND "deletedAt" IS NULL
      `,
      [loginOrEmail]
    );

    return user || null;
  }

  private async create(dto: CreateUserDto) {
    const { login, email, passwordHash, isConfirmed } = dto;

    const [user]: IUserEntityDto[] = await this.dataSource.query(
      `
        INSERT INTO users (login, email, "passwordHash")
          VALUES ($1, $2, $3)
          RETURNING *
      `,
      [login, email, passwordHash]
    );

    if (isConfirmed) {
      await this.dataSource.query(
        `
        INSERT INTO user_confirmations ("userId", "isConfirmed")
          VALUES ($1, true)
      `,
        [user.id]
      );
    } else {
      await this.dataSource.query(
        `
        INSERT INTO user_confirmations ("userId", "isConfirmed", code, "expirationDate")
          VALUES ($1, false, $2, $3)
      `,
        [user.id, dto.confirmationCode, dto.expirationDate]
      );
    }

    return user;
  }

  async createConfirmedUser(dto: { login: string; email: string; passwordHash: string }) {
    const user = await this.create({ ...dto, isConfirmed: true });

    return user;
  }

  async createUnconfirmedUser(dto: {
    login: string;
    email: string;
    passwordHash: string;
    confirmationCode: string;
    expirationDate: Date;
  }) {
    const user = await this.create({ ...dto, isConfirmed: false });

    return user;
  }

  async softDelete(userId: string): Promise<boolean> {
    const deletedAt = new Date();

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      UPDATE users
        SET "deletedAt" = $1
        WHERE users.id = $2 AND "deletedAt" IS NULL
        RETURNING id
      `,
      [deletedAt, userId]
    );

    return rows.length > 0;
  }

  async updateUserPassword(dto: { userId: string; passwordHash: string }) {
    const { userId, passwordHash } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      UPDATE users
        SET "passwordHash" = $2
        WHERE id = $1
        RETURNING id
      `,
      [userId, passwordHash]
    );

    return rows.length > 0;
  }

  async findRegistrationConfirmationData(
    userId: string
  ): Promise<IUserConfirmationEntityDto | null> {
    const [confirmationData]: IUserConfirmationEntityDto[] = await this.dataSource.query(
      `SELECT * 
        FROM "user_confirmations" 
        WHERE "userId" = $1`,
      [userId]
    );

    return confirmationData || null;
  }

  async confirmRegistrationByCode(code: string) {
    const [rows]: [{ userId: string }[], number] = await this.dataSource.query(
      `
      UPDATE "user_confirmations"
        SET "isConfirmed" = true, code = NULL, "expirationDate" = NULL
        WHERE code = $1 AND "isConfirmed" = false AND "expirationDate" > NOW()
        RETURNING "userId"
      `,
      [code]
    );

    return rows.length > 0;
  }

  async updateRegistrationConfirmationData(dto: {
    userId: string;
    confirmationCode: string;
    expirationDate: Date;
  }) {
    const [rows]: [{ userId: string }[], number] = await this.dataSource.query(
      `
      UPDATE "user_confirmations"
        SET code = $2, "expirationDate" = $3
        WHERE "userId" = $1 
        RETURNING "userId"
      `,
      [dto.userId, dto.confirmationCode, dto.expirationDate]
    );

    return rows.length > 0;
  }

  async findPasswordRecoveryData(code: string): Promise<IPasswordRecoveryEntityDto | null> {
    const [recoveryData]: IPasswordRecoveryEntityDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM user_recovery_codes
        WHERE "user_recovery_codes".code = $1 AND "expirationDate" > NOW()
      `,
      [code]
    );

    return recoveryData || null;
  }

  async upsertPasswordRecoveryData(dto: IPasswordRecoveryEntityDto) {
    const { userId, code, expirationDate } = dto;

    const [rows]: [{ userId: string }[], number] = await this.dataSource.query(
      `
    INSERT INTO "user_recovery_codes" ("userId", code, "expirationDate")
    VALUES ($1, $2, $3)
    ON CONFLICT ("userId") 
    DO UPDATE SET 
      code = EXCLUDED.code,
      "expirationDate" = EXCLUDED."expirationDate"
    RETURNING "userId"
    `,
      [userId, code, expirationDate]
    );

    return rows.length > 0;
  }

  async deletePasswordRecoveryData(userId: string) {
    const [rows]: [{ userId: string }[], number] = await this.dataSource.query(
      `
    DELETE FROM "user_recovery_codes"
      WHERE "userId" = $1
      RETURNING "userId"
    `,
      [userId]
    );

    return rows.length > 0;
  }
}
