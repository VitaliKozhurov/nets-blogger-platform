import { HydratedDocument, Model } from 'mongoose';
import { Like } from './like.schema';
import { CreateLikeDto } from './like.dto';

export type LikeDocument = HydratedDocument<Like>;

export type LikeMethodsType = {
  someMethod(): void;
};

export type LikeStaticMethodsType = {
  createInstance(args: CreateLikeDto): LikeDocument;
};

export type LikeModelType = Model<LikeDocument, unknown, LikeMethodsType> & LikeStaticMethodsType;
