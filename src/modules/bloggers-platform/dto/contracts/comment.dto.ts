import { IBaseQueryParamsDto } from 'src/core/dto';
import { LikeStatus } from './like.dto';

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
}

export interface ICommentResponseDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
}

export interface IGetCommentsByPostIdQueryParamsDto extends IBaseQueryParamsDto {
  sortBy: CommentsSortBy;
}
