import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePostRequestDto } from '@modules/bloggers-platform/posts/api/dto';
import { ApiErrorResponse } from 'src/core/decorators';

export const UpdatePostSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a post',
      description: 'Updates an existing post with the provided information.',
    }),
    ApiBody({
      type: UpdatePostRequestDto,
      description:
        'Data for updating the post, including title, shortDescription, content, and blogId.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Post body has incorrect values',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'title', message: 'Title is too long' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access — authentication required',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Post not found — the specified post does not exist',
    })
  );
};
