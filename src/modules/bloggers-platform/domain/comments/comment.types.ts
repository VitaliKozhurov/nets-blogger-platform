import { HydratedDocument, Model } from 'mongoose';
import { Comment } from './comment.schema';
import { LikeStatus } from '../../dto/contracts/like.dto';
import { LikeDocument } from '../likes/like.types';

export type CommentDocument = HydratedDocument<Comment>;

export type CommentMethodsType = {
  softDelete(): void;
  updateContent(content: string): void;
  applyIncomingLikeStatus(likeStatus: LikeStatus): void;
  updateLikesInfo(args: { currentLike: LikeDocument; nextLikeStatus: LikeStatus }): void;
};

export type CommentStaticMethodsType = {
  someMethod(): void;
};

export type CommentModelType = Model<CommentDocument, unknown, CommentMethodsType> &
  CommentStaticMethodsType;
