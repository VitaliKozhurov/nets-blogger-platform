import { HydratedDocument, Model } from 'mongoose';

import { CreateUserInstanceDto } from './user.dto';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<User, UserMethodsType>;

export type UserMethodsType = {
  softDelete(): void;
  setPasswordRecoverySettings(): string;
};

export type UserStaticMethodsType = {
  createInstance(dto: CreateUserInstanceDto): Promise<UserDocument>;
  checkIsUserExist(dto: {
    login: string;
    email: string;
  }): Promise<{ isExist: true; field: 'login' | 'email' } | { isExist: false }>;
};

export type UserModelType = Model<UserDocument, unknown, UserMethodsType> & UserStaticMethodsType;
