import { LikeStatus } from '../../../likes/domain/dto';

export interface IPostWithDetails {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date;
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
