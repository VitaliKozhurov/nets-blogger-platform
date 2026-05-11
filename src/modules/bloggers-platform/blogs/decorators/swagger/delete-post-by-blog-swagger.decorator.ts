import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';

export const DeletePostByBlogSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a post',
      description: 'Permanently deletes a blog by ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the blog',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiParam({
      name: 'postId',
      description: 'Unique identifier of the post to delete',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Post successfully deleted. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized error.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Post with the specified ID was not found.',
    })
  );
};
