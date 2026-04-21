import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/core/decorators';
import { GetPostsQueryDto } from '@modules/bloggers-platform/posts/api/dto';
import { PostResponseDto } from '@modules/bloggers-platform/posts/api/dto';

export const GetPostsSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve posts list',
      description:
        'Fetches a paginated list of users with support for filtering, sorting, and searching. Returns users based on the provided query parameters.',
    }),
    ApiQuery({ type: GetPostsQueryDto }),
    ApiOkResponsePaginated(PostResponseDto)
  );
};
