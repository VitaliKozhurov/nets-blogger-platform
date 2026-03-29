import { HydratedDocument, Model } from 'mongoose';
import { Like } from './like.schema';

export type LikeDocument = HydratedDocument<Like>;

export type LikeMethodsType = {
  someMethod(): void;
};

export type LikeStaticMethodsType = {
  someMethod(): void;
};

export type LikeModelType = Model<Like, unknown, LikeMethodsType> & LikeStaticMethodsType;
