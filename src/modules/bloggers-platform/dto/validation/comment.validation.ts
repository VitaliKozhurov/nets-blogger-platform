import { BaseQueryParamsValidationDto } from 'src/core/dto';
import { CommentsSortBy, IGetCommentsByPostIdQueryParamsDto } from '../contracts/comment.dto';
import { IsEnum } from 'class-validator';

export class GetCommentsByPostIdQueryParamsValidationDto
  extends BaseQueryParamsValidationDto
  implements IGetCommentsByPostIdQueryParamsDto
{
  @IsEnum(CommentsSortBy)
  sortBy: CommentsSortBy;
}
