import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { User } from '../domain';
import { UserDocument, type UserModelType } from '../domain';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IUserDbDto } from './dto/user-db.dto';
import { IUserViewDto } from './dto/user-view.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  async findById(id: string) {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    return user;
  }

  async findByIdOrThrow(id: string) {
    const user = await this.UserModel.findOne({
      _id: id,
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

  // async findByLoginOrEmail(loginOrEmail: string) {
  //   const user = await this.UserModel.findOne({
  //     $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
  //     deletedAt: null,
  //   }).exec();

  //   return user;
  // }

  async findByPasswordRecoveryCode(code: string) {
    const user = await this.UserModel.findOne({
      'passwordRecovery.code': code,
      deletedAt: null,
    }).exec();

    return user;
  }

  async findByRegistrationConfirmationCode(confirmationCode: string) {
    const user = await this.UserModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
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

  async findByLoginOrEmail(loginOrEmail: string) {
    const [user]: IUserDbDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE users.login = $1 OR users.email = $1
      `,
      [loginOrEmail]
    );

    const currentUser = user ? user : null;

    return currentUser;
  }

  async createByAdmin(dto: { login: string; email: string; passwordHash: string }) {
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
}
