import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { User, type UserModelType } from '../domain';
import { IConfirmationCodeDto } from './dto/confirmation-code.dto';
import { IUserDbDto } from './dto/user-db.dto';
import { IUserViewDto } from './dto/user-view.dto';
import { IPasswordRecoveryRepositoryDto } from './dto/password-recovery-repository.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  async findByLoginOrEmail(loginOrEmail: string) {
    const [user]: IUserDbDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE (users.login = $1 OR users.email = $1) AND "deletedAt" IS NULL
      `,
      [loginOrEmail]
    );

    return user || null;
  }

  async findById(id: string) {
    const [user]: IUserDbDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE users.id = $1 AND "deletedAt" IS NULL
      `,
      [id]
    );

    return user || null;
  }

  async findByIdOrThrow(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'User not found',
      });
    }

    return user;
  }

  async createWithConfirmedStatus(dto: { login: string; email: string; passwordHash: string }) {
    const { login, email, passwordHash } = dto;

    const [user]: IUserViewDto[] = await this.dataSource.query(
      `
        INSERT INTO users (login, email, "passwordHash")
          VALUES ($1, $2, $3)
          RETURNING id
      `,
      [login, email, passwordHash]
    );

    const userId = user.id;

    await this.dataSource.query(
      `
        INSERT INTO user_confirmations ("userId", "isConfirmed")
          VALUES ($1, true)
      `,
      [userId]
    );

    return user;
  }

  async createWithUnconfirmedStatus(dto: {
    login: string;
    email: string;
    passwordHash: string;
    confirmationCode: string;
    expirationDate: Date;
  }) {
    const { login, email, passwordHash, confirmationCode, expirationDate } = dto;

    const [user]: IUserViewDto[] = await this.dataSource.query(
      `
        INSERT INTO users (login, email, "passwordHash")
          VALUES ($1, $2, $3)
          RETURNING id
      `,
      [login, email, passwordHash]
    );

    const userId = user.id;

    await this.dataSource.query(
      `
        INSERT INTO user_confirmations ("userId", "isConfirmed", code, "expirationDate")
          VALUES ($1, false, $2, $3)
      `,
      [userId, confirmationCode, expirationDate]
    );

    return user;
  }

  async softDelete(userId: string): Promise<boolean> {
    const deletedAt = new Date();

    const result: { id: string }[] = await this.dataSource.query(
      `
      UPDATE users
        SET "deletedAt" = $1
        WHERE users.id = $2 AND "deletedAt" IS NULL
        RETURNING id
      `,
      [deletedAt, userId]
    );

    return result.length > 0;
  }

  async confirmUserRegistrationByCode(code: string) {
    const result: { userId: string }[] = await this.dataSource.query(
      `
      UPDATE "user_confirmations"
        SET "isConfirmed" = true, code = NULL, "expirationDate" = NULL
        WHERE code = $1 
        AND "isConfirmed" = false 
        AND "expirationDate" > NOW()
        RETURNING "userId"
      `,
      [code]
    );

    return result.length > 0;
  }

  async findConfirmationByUserId(userId: string): Promise<IConfirmationCodeDto | null> {
    const [result]: IConfirmationCodeDto[] = await this.dataSource.query(
      `SELECT * FROM "user_confirmations" WHERE "userId" = $1`,
      [userId]
    );

    return result || null;
  }

  async updateRegistrationConfirmationCode(dto: {
    userId: string;
    confirmationCode: string;
    expirationDate: Date;
  }) {
    const result: { userId: string }[] = await this.dataSource.query(
      `
      UPDATE "user_confirmations"
        SET code = $1, "expirationDate" = $2
        WHERE "userId" = $3 
        RETURNING "userId"
      `,
      [dto.confirmationCode, dto.expirationDate, dto.userId]
    );

    return result.length > 0;
  }

  async updateUserPassword(dto: { userId: string; passwordHash: string }) {
    const { userId, passwordHash } = dto;

    const result: { id: string }[] = await this.dataSource.query(
      `
    UPDATE users
      SET "passwordHash" = $2
      WHERE "userId" = $1
      RETURNING id
    `,
      [userId, passwordHash]
    );

    return result.length > 0;
  }

  async deletePasswordRecoveryData(userId: string) {
    const result: { userId: string }[] = await this.dataSource.query(
      `
    DELETE FROM "user_recovery_codes"
      WHERE "userId" = $1
      RETURNING "userId"
    `,
      [userId]
    );

    return result.length > 0;
  }

  async upsertUserPasswordRecoveryData(dto: {
    userId: string;
    code: string;
    expirationDate: Date;
  }) {
    const { userId, code, expirationDate } = dto;

    const result = await this.dataSource.query(
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

    return result.length > 0;
  }

  async findPasswordRecoveryData(code: string): Promise<IPasswordRecoveryRepositoryDto | null> {
    const [result]: IPasswordRecoveryRepositoryDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM user_recovery_codes
        WHERE "user_recovery_codes".code = $1 AND "expirationDate" > NOW()
      `,
      [code]
    );

    return result?.[0] || null;
  }

  async findByLoginOrEmailOrThrow(loginOrEmail: string) {
    const user = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'User not found',
      });
    }

    return user;
  }

  // async save(userDocument: UserDocument) {
  //   await userDocument.save();
  // }
}
