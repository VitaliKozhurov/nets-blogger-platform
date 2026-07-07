import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';

export interface ICommentsWithDetailsDto {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userLogin: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
