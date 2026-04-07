import { HydratedDocument, Model } from 'mongoose';

import { CreateUserInstanceDto } from './user.dto';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<User, UserMethodsType>;

export type UserMethodsType = {
  softDelete(): void;
  setPasswordRecoverySettings(): string;
  validatePasswordRecoveryCode(recoveryCode: string): boolean;
  updatePassword(password: string): UserDocument;
  validateRegistrationConfirmationCode(code: string): boolean;
  confirmRegistration(): UserDocument;
  updateRegistrationConfirmationCode(): UserDocument;
};

export type UserStaticMethodsType = {
  createInstance(dto: CreateUserInstanceDto): Promise<UserDocument>;
  checkIsUserExist(dto: {
    login: string;
    email: string;
  }): Promise<{ isExist: true; field: 'login' | 'email' } | { isExist: false }>;
  createUnconfirmedUser(dto: CreateUserInstanceDto): Promise<UserDocument>;
};

export type UserModelType = Model<UserDocument, unknown, UserMethodsType> & UserStaticMethodsType;
