import { IsEnum } from 'class-validator';
import { BaseQueryParamsValidationDto } from 'src/core/dto';
import { Nullable } from 'src/core/types';
import { BlogsSortBy, ICreateBlogDto, IGetBlogsQueryParamsDto } from '../contracts/blog.dto';

export class CreateBlogRequestBodyValidationDto implements ICreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class UpdateBlogRequestBodyValidationDto extends CreateBlogRequestBodyValidationDto {}

export class GetBlogsQueryParamsValidationDto
  extends BaseQueryParamsValidationDto
  implements IGetBlogsQueryParamsDto
{
  searchNameTerm: Nullable<string>;

  @IsEnum(BlogsSortBy)
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
}
