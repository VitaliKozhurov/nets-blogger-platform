import { IsEnum } from 'class-validator';
import { BaseQueryParamsDto } from 'src/core/dto/validation/base-query-params.validation';
import { IGetPostsQueryParamsDto, PostsSortBy } from '../contracts/post.dto';

// export class CreatePostByBlogIdRequestBodyValidationDto extends OmitType(
//   CreatePostRequestBodyValidationDto,
//   ['blogId']
// ) {}

// export class UpdatePostRequestBodyValidationDto extends CreatePostRequestBodyValidationDto {}

export class GetPostsQueryParamsValidationDto
  extends BaseQueryParamsDto
  implements IGetPostsQueryParamsDto
{
  @IsEnum(PostsSortBy)
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;
}
