import { LikeStatus } from '.';

export interface IPostLikeEntityDto {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
}

export interface ICommentLikeEntityDto {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
}
