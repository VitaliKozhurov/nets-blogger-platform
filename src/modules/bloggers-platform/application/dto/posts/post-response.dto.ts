import { LikeStatus } from '../../../domain/likes/like.dto';

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
