import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/core/decorators';
import { GetPostsQueryDto } from '../../../api/dto/posts/get-posts-query.dto';
import { PostResponseDto } from '../../../api/dto/posts/post-response.dto';

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
