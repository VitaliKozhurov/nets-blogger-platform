import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { UpdateCommentLikeStatusRequestDto } from '../../../api/dto/comments/update-comment-like-status.dto';

export const UpdateCommentLikeStatusSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a comment like status',
      description: 'Update a comment like status by ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the comment to updating',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiBody({
      type: UpdateCommentLikeStatusRequestDto,
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
        extensions: [{ field: 'likeStatus', message: 'Incorrect like status' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized error.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Comment with the specified ID was not found.',
    })
  );
};
