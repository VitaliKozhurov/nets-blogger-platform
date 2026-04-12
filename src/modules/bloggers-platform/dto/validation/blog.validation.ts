import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryParamsDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { BlogsSortBy, IGetBlogsQueryParamsDto } from '../contracts/blog.dto';

export class GetBlogsQueryParamsValidationDto
  extends BaseQueryParamsDto
  implements IGetBlogsQueryParamsDto
{
  @IsOptional()
  searchNameTerm: Nullable<string>;

  @IsEnum(BlogsSortBy)
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
}
