import { HydratedDocument, Model } from 'mongoose';
import { Comment } from './comment.schema';

export type CommentDocument = HydratedDocument<Comment>;

export type CommentMethodsType = {
  someMethod(): void;
};

export type CommentStaticMethodsType = {
  someMethod(): void;
};

export type CommentModelType = Model<Comment, unknown, CommentMethodsType> &
  CommentStaticMethodsType;
