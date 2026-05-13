import { LikeStatus } from 'src/modules/bloggers-platform/likes';

export interface IPostRepository {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  deletedAt: Date | null;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
