import { HydratedDocument, Model } from 'mongoose';

import { CreateUserInstanceDto } from '../../dto/users/create-user-instance.dto';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<User, UserMethodsType>;

export type UserMethodsType = {
  softDelete(): void;
};

export type UserStaticMethodsType = {
  createInstance(dto: CreateUserInstanceDto): Promise<UserDocument>;
};

export type UserModelType = Model<User, unknown, UserMethodsType> & UserStaticMethodsType;
