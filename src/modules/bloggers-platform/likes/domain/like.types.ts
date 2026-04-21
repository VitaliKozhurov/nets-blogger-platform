import { HydratedDocument, Model } from 'mongoose';
import { Like } from './like.schema';
import { CreateLikeDto, LikeStatus } from './like.dto';

export type LikeDocument = HydratedDocument<Like, LikeMethodsType>;

export type LikeMethodsType = {
  updateLikeStatus(likeStatus: LikeStatus): void;
};

export type LikeStaticMethodsType = {
  createInstance(args: CreateLikeDto): LikeDocument;
};

export type LikeModelType = Model<LikeDocument, unknown, LikeMethodsType> & LikeStaticMethodsType;
