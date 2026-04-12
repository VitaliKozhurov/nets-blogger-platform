import { OmitType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseQueryParamsDto } from 'src/core/dto/validation/base-query-params.validation';
import { ICreatePostDto, IGetPostsQueryParamsDto, PostsSortBy } from '../contracts/post.dto';

export class CreatePostRequestBodyValidationDto implements ICreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class CreatePostByBlogIdRequestBodyValidationDto extends OmitType(
  CreatePostRequestBodyValidationDto,
  ['blogId']
) {}

export class UpdatePostRequestBodyValidationDto extends CreatePostRequestBodyValidationDto {}

export class GetPostsQueryParamsValidationDto
  extends BaseQueryParamsDto
  implements IGetPostsQueryParamsDto
{
  @IsEnum(PostsSortBy)
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;
}
