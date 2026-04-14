import { HydratedDocument, Model } from 'mongoose';
import { Comment } from './comment.schema';
import { LikeDocument } from '../likes/like.types';
import { LikeStatus } from '../likes/like.dto';
import { CreateCommentInstanceDto } from './comment.dto';

export type CommentDocument = HydratedDocument<Comment, CommentMethodsType>;

export type CommentMethodsType = {
  softDelete(): void;
  updateContent(content: string): void;
  applyIncomingLikeStatus(likeStatus: LikeStatus): void;
  updateLikesInfo(args: { currentLike: LikeDocument; nextLikeStatus: LikeStatus }): void;
};

export type CommentStaticMethodsType = {
  createInstance(dto: CreateCommentInstanceDto): CommentDocument;
};

export type CommentModelType = Model<CommentDocument, unknown, CommentMethodsType> &
  CommentStaticMethodsType;
