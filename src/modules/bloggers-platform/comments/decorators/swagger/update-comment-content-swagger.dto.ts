import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { UpdateCommentContentRequestDto } from '../../api/dto';

export const UpdateCommentContentSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a comment content',
      description: 'Update a comment content by ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the comment to updating',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiBody({
      type: UpdateCommentContentRequestDto,
      description: 'Comment update data including content',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Comment successfully updated. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'The inputModel has incorrect values.',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'content', message: 'Content too large' }],
      },
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
