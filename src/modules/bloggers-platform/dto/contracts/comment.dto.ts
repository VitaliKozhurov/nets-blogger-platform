import { IBaseQueryParamsDto } from 'src/core/dto';

export interface IGetCommentsByPostIdQueryParamsDto extends IBaseQueryParamsDto {
  sortBy: CommentsSortBy;
}
