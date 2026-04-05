import { IsEnum } from 'class-validator';
import { BaseQueryParamsValidationDto } from 'src/core/dto';
import { Nullable } from 'src/core/types';
import { BlogsSortBy, ICreateBlogDto, IGetBlogsQueryParamsDto } from '../contracts/blog.dto';

export class CreateBlogRequestBodyDto implements ICreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class UpdateBlogRequestBodyDto extends CreateBlogRequestBodyDto {}

export class GetBlogsQueryParamsDto
  extends BaseQueryParamsValidationDto
  implements IGetBlogsQueryParamsDto
{
  searchNameTerm: Nullable<string>;

  @IsEnum(BlogsSortBy)
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
}
