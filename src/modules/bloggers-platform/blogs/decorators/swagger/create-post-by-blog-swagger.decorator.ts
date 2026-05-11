import { PostResponseDto } from '@modules/bloggers-platform/posts/api/dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { CreatePostByBlogRequestDto } from '../../api';

export const CreatePostByBlogSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new post',
      description:
        'Creates a new post with the provided information. Returns the created post data.',
    }),
    ApiBody({
      type: CreatePostByBlogRequestDto,
      description:
        'Post creation data including title,shortDescription, content,blogId and blogName',
    }),
    ApiCreatedResponse({
      type: PostResponseDto,
      description: 'Returns the newly created post',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Incorrect input values',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'title', message: 'Incorrect title' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    })
  );
};
