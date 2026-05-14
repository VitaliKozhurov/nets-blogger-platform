import { LikeStatus } from '../../domain';

export interface IPostLikeRepository {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
}

export interface ICommentLikeRepository {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
}
