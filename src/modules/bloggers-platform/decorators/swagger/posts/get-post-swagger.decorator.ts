import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { PostResponseDto } from 'src/modules/bloggers-platform/api/dto/posts/post-response.dto';

export const GetPostSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a post',
      description: 'Retrieves a post by its ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the post to retrieve',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      type: PostResponseDto,
      description: 'Post successfully retrieved.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Post with the specified ID was not found.',
    })
  );
};
