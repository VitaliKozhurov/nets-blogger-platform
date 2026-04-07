import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParamsValidationDto } from 'src/core/dto';
import { type Nullable } from 'src/core/types';
import { BlogsSortBy, ICreateBlogDto, IGetBlogsQueryParamsDto } from '../contracts/blog.dto';

export class CreateBlogRequestBodyValidationDto implements ICreateBlogDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  websiteUrl: string;
}

export class UpdateBlogRequestBodyValidationDto extends CreateBlogRequestBodyValidationDto {}

export class GetBlogsQueryParamsValidationDto
  extends BaseQueryParamsValidationDto
  implements IGetBlogsQueryParamsDto
{
  @IsOptional()
  searchNameTerm: Nullable<string>;

  @IsEnum(BlogsSortBy)
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
}
