import { LikeStatus } from '@modules/bloggers-platform/likes/domain';

export interface IPostResponseDto {
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
    newestLikes: NewestLike[];
  };
}

type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};
