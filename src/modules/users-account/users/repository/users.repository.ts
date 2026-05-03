import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { IConfirmationCodeRepositoryDto } from './dto/confirmation-code-repository.dto';
import { IUserRepositoryDto } from './dto/user-repository.dto';
import { IPasswordRecoveryRepositoryDto } from './dto/password-recovery-repository.dto';
import { UserResponseMapperDto } from '../api';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(id: string) {
    const [user]: IUserRepositoryDto[] = await this.dataSource.query(
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

  async findByLoginOrEmail(loginOrEmail: string) {
    const [user]: IUserRepositoryDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE (users.login = $1 OR users.email = $1) AND "deletedAt" IS NULL
      `,
      [loginOrEmail]
    );

    return user || null;
  }

  async createWithConfirmedStatus(dto: { login: string; email: string; passwordHash: string }) {
    const { login, email, passwordHash } = dto;

    const [user]: IUserRepositoryDto[] = await this.dataSource.query(
      `
        INSERT INTO users (login, email, "passwordHash")
          VALUES ($1, $2, $3)
          RETURNING *
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

    return UserResponseMapperDto.mapToView(user);
  }

  async createWithUnconfirmedStatus(dto: {
    login: string;
    email: string;
    passwordHash: string;
    confirmationCode: string;
    expirationDate: Date;
  }) {
    const { login, email, passwordHash, confirmationCode, expirationDate } = dto;

    const [user]: IUserRepositoryDto[] = await this.dataSource.query(
      `
        INSERT INTO users (login, email, "passwordHash")
          VALUES ($1, $2, $3)
          RETURNING *
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

    return UserResponseMapperDto.mapToView(user);
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

  async findRegistrationConfirmationByUserId(
    userId: string
  ): Promise<IConfirmationCodeRepositoryDto | null> {
    const [confirmationData]: IConfirmationCodeRepositoryDto[] = await this.dataSource.query(
      `SELECT * 
        FROM "user_confirmations" 
        WHERE "userId" = $1`,
      [userId]
    );

    return confirmationData || null;
  }

  async updateRegistrationConfirmation(dto: {
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

  async findPasswordRecoveryByCode(code: string): Promise<IPasswordRecoveryRepositoryDto | null> {
    const [recoveryInfo]: IPasswordRecoveryRepositoryDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM user_recovery_codes
        WHERE "user_recovery_codes".code = $1 AND "expirationDate" > NOW()
      `,
      [code]
    );

    return recoveryInfo || null;
  }

  async upsertPasswordRecoveryByUserId(dto: IPasswordRecoveryRepositoryDto) {
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

  async deletePasswordRecoveryByUserId(userId: string) {
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
}
