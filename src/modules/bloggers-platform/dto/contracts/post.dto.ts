import { IBaseQueryParamsDto } from 'src/core/dto';
import { LikeStatus } from './like.dto';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export enum PostsSortBy {
  BlogName = 'blogName',
  Title = 'title',
  CreatedAt = 'createdAt',
}

export interface ICreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface IUpdatePostDto {}

type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

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

export interface IGetPostsQueryParamsDto extends IBaseQueryParamsDto {
  sortBy: PostsSortBy;
}
