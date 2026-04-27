import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { User } from '../domain';
import { UserDocument, type UserModelType } from '../domain';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

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

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      deletedAt: null,
    }).exec();

    return user;
  }

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

  async create(dto: { login: string; email: string; passwordHash: string }) {
    const { login, email, passwordHash } = dto;

    const user = await this.dataSource.query(
      `
        INSERT INTO users (login, email, "passwordHash", "isConfirmed")
          VALUES ($1, $2, $3, true)
      `,
      [login, email, passwordHash]
    );

    console.log(user);
  }
}
