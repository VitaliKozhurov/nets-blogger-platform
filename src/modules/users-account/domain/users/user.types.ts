import { HydratedDocument, Model } from 'mongoose';

import { User } from './user.schema';
import { CreateUserInstanceDto } from '../../dto/users/create-user-instance.dto';

export type UserDocument = HydratedDocument<User, UserMethodsType>;

export type UserMethodsType = {
  softDelete(): void;
};

export type UserStaticMethodsType = {
  createInstance(dto: CreateUserInstanceDto): Promise<UserDocument>;
};

export type UserModelType = Model<UserDocument, unknown, UserMethodsType> & UserStaticMethodsType;
