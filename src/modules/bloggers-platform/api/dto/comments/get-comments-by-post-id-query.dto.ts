import { IsEnum } from 'class-validator';
import { BaseQueryParamsDto, IBaseQueryParamsDto } from 'src/core/dto';
import { CommentsSortBy } from './comment-sort-by.dto';

export class GetCommentsByPostIdQueryDto extends BaseQueryParamsDto {
  @IsEnum(CommentsSortBy)
  sortBy: CommentsSortBy;
}

export interface IGetCommentsByPostIdQueryDto extends IBaseQueryParamsDto {
  sortBy: CommentsSortBy;
}
