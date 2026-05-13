import { LikeStatus } from 'src/modules/bloggers-platform/likes';

export interface ICommentRepositoryDto {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userLogin: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
