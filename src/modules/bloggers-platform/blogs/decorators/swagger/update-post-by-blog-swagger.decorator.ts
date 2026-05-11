import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { UpdatePostByBlogRequestDto } from '../../api';

export const UpdatePostByBlogSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a post',
      description: 'Updates an existing post with the provided information.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the blog',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiParam({
      name: 'postId',
      description: 'Unique identifier of the post',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiBody({
      type: UpdatePostByBlogRequestDto,
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
