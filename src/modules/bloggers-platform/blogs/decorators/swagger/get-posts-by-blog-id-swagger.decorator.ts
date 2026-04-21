import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/core/decorators';
import { GetPostsQueryDto } from '@modules/bloggers-platform/posts/api/dto';
import { PostResponseDto } from '@modules/bloggers-platform/posts/api/dto';

export const GetPostsByBlogIdSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve posts list',
      description:
        'Fetches a paginated list of users with support for filtering, sorting, and searching. Returns users based on the provided query parameters.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the blog',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiQuery({ type: GetPostsQueryDto }),
    ApiOkResponsePaginated(PostResponseDto)
  );
};
