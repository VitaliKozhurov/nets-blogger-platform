import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { CommentResponseDto } from '../../../api/dto/comments/comment-response.dto';

export const GetCommentSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a comment',
      description: 'Retrieves a comment by its ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the comment to retrieve',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      type: CommentResponseDto,
      description: 'Comment successfully retrieved.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Comment with the specified ID was not found.',
    })
  );
};
