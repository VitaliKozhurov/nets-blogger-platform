import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource, Repository } from 'typeorm';
import { IPasswordRecoveryEntityDto, IUserEntityDto } from '../domain/dto';
import { UserEntity } from '../domain/user.entity';
import { UserConfirmationEntity } from '../domain/user-confirmation.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    @InjectRepository(UserConfirmationEntity)
    private usersConfirmationRepo: Repository<UserConfirmationEntity>,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  async save(user: UserEntity) {
    return await this.usersRepo.save(user);
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

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
    const user = await this.usersRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
      withDeleted: false,
      relations: {
        confirmation: true,
        recoveryCode: true,
      },
    });

    return user;
  }

  async softDelete(userId: string): Promise<boolean> {
    const { affected } = await this.usersRepo.softDelete({ id: userId });

    return affected === 1;
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

  async confirmRegistrationByCode(code: string) {
    const { affected } = await this.usersConfirmationRepo.update(
      { code },
      { isConfirmed: true, code: null, expirationDate: null }
    );

    return affected === 1;
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
