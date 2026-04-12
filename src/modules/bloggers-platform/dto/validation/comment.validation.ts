import { IsEnum } from 'class-validator';
import { BaseQueryParamsDto } from 'src/core/dto';
import { CommentsSortBy, IGetCommentsByPostIdQueryParamsDto } from '../contracts/comment.dto';

export class GetCommentsByPostIdQueryParamsValidationDto
  extends BaseQueryParamsDto
  implements IGetCommentsByPostIdQueryParamsDto
{
  @IsEnum(CommentsSortBy)
  sortBy: CommentsSortBy;
}
