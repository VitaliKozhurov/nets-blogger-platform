import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { CreateCommentRequestDto } from 'src/modules/bloggers-platform/api/dto/comments/create-comment.dto';
import { CommentResponseDto } from '../../../api/dto/comments/comment-response.dto';

export const CreateCommentByPostIdSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new comment',
      description:
        'Creates a new comment with the provided information. Returns the created comment data.',
    }),
    ApiBody({
      type: CreateCommentRequestDto,
      description: 'Comment creation data including content.',
    }),
    ApiCreatedResponse({
      type: CommentResponseDto,
      description: 'Returns the newly created post',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Incorrect input values',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'content', message: 'Incorrect content' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: "If post with specified postId doesn't exists",
    })
  );
};
