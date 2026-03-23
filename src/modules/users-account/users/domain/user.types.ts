import { HydratedDocument, Model } from 'mongoose';
import { CreateUserInstanceDto } from '../dto/create-user-instance.dto';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<User, UserMethodsType>;

export type UserMethodsType = {
  softDelete(): void;
};

export type UserStaticMethodsType = {
  createInstance(dto: CreateUserInstanceDto): UserDocument;
};

export type UserModuleType = Model<User, unknown, UserMethodsType> & UserStaticMethodsType;
