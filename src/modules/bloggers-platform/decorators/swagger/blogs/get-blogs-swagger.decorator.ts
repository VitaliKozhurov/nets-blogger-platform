import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/core/decorators';
import { BlogResponseDto } from '../../../api/dto/blogs/blog-response.dto';
import { GetBlogsQueryDto } from '../../../api/dto/blogs/get-blogs-query.dto';

export const GetBlogsSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve blogs list',
      description:
        'Fetches a paginated list of users with support for filtering, sorting, and searching. Returns users based on the provided query parameters.',
    }),
    ApiQuery({ type: GetBlogsQueryDto }),
    ApiOkResponsePaginated(BlogResponseDto)
  );
};
