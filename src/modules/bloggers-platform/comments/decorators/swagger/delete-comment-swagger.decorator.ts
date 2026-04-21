import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';

export const DeleteCommentSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a comment',
      description: 'Permanently deletes a comment by ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the comment to delete',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Comment successfully deleted. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized error.',
    }),
    ApiErrorResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Try delete the comment that is not your own.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Comment with the specified ID was not found.',
    })
  );
};
