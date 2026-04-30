import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { User, UserDocument, type UserModelType } from '../domain';
import { IUserDbDto } from './dto/user-db.dto';
import { IUserViewDto } from './dto/user-view.dto';

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
        WHERE users.login = $1 OR users.email = $1 AND "deletedAt" IS NULL
      `,
      [loginOrEmail]
    );

    const currentUser = user ? user : null;

    return currentUser;
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

    const currentUser = user ? user : null;

    return currentUser;
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

  async findByPasswordRecoveryCode(code: string) {
    const user = await this.UserModel.findOne({
      'passwordRecovery.code': code,
      deletedAt: null,
    }).exec();

    return user;
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

  async save(userDocument: UserDocument) {
    await userDocument.save();
  }
}
