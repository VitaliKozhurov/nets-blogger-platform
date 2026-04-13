import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreatePostRequestDto } from 'src/modules/bloggers-platform/api/dto/posts/create-post.dto';
import { PostResponseDto } from '../../../api/dto/posts/post-response.dto';

export const CreatePostSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new post',
      description:
        'Creates a new post with the provided information. Returns the created post data.',
    }),
    ApiBody({
      type: CreatePostRequestDto,
      description:
        'Post creation data including title,shortDescription, content,blogId and blogName',
    }),
    ApiCreatedResponse({
      type: PostResponseDto,
      description: 'Returns the newly created post',
    })
  );
};
