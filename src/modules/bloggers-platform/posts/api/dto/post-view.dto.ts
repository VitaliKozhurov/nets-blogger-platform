import { LikeStatus } from '@modules/bloggers-platform/likes';

export interface IPostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: { addedAt: string; userId: string; login: string }[];
  };
}
