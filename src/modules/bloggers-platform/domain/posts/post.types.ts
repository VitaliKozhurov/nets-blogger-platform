import { HydratedDocument, Model } from 'mongoose';
import { Post } from './post.schema';

export type PostDocument = HydratedDocument<Post, PostMethodsType>;

export type PostMethodsType = {
  softDelete(): void;
};

export type PostStaticMethodsType = {
  someMethod(): void;
};

export type PostModelType = Model<PostDocument, unknown, PostMethodsType> & PostStaticMethodsType;
