import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateBlogRequestDto } from '../../api/dto';
import { BlogResponseDto } from '../../api/dto';

export const CreateBlogSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new blog',
      description:
        'Creates a new blog with the provided information. Returns the created blog data.',
    }),
    ApiBody({
      type: CreateBlogRequestDto,
      description: 'Blog creation data including name, description, and website URL',
    }),
    ApiCreatedResponse({
      type: BlogResponseDto,
      description: 'Returns the newly created blog',
    })
  );
};
