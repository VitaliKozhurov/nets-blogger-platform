import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';

export interface IUpdatePostLikeStatusDto {
  postId: string;
  userId: string;
  likeStatus: LikeStatus;
}
