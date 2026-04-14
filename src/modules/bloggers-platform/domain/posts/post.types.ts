import { HydratedDocument, Model } from 'mongoose';
import { CreatePostInstanceDto, UpdatePostDto } from './post.dto';
import { Post } from './post.schema';
import { LikeStatus } from '../likes/like.dto';
import { LikeDocument } from '../likes/like.types';

export type PostDocument = HydratedDocument<Post, PostMethodsType>;

export type PostMethodsType = {
  softDelete(): void;
  update(dto: UpdatePostDto): PostDocument;
  applyIncomingLikeStatus(likeStatus: LikeStatus): void;
  updateLikesInfo(args: { currentLike: LikeDocument; nextLikeStatus: LikeStatus }): void;
};

export type PostStaticMethodsType = {
  createInstance(dto: CreatePostInstanceDto): Promise<PostDocument>;
};

export type PostModelType = Model<PostDocument, unknown, PostMethodsType> & PostStaticMethodsType;
