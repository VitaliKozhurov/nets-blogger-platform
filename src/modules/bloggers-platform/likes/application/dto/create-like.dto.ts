import { LikeStatus } from '../../domain/dto';

export interface ICreateCommentLikeDto {
  userId: string;
  commentId: string;
  likeStatus: LikeStatus;
}

export interface ICreatePostLikeDto {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
}
