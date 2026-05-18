import { LikeStatus } from '@modules/bloggers-platform/likes/domain';

export interface IUpdatePostLikeStatusDto {
  postId: string;
  userId: string;
  likeStatus: LikeStatus;
}
