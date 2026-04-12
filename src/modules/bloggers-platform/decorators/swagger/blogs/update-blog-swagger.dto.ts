import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateBlogRequestDto } from '../../../api/dto/blogs/update-blog.dto';
import { ApiErrorResponse } from 'src/core/decorators';

export const UpdateBlogSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new blog',
      description: 'Update blog with the provided information.',
    }),
    ApiBody({
      type: UpdateBlogRequestDto,
      description: 'Blog update data including name, description, and website URL',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Blog successfully updated. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Returns when data is incorrect.',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'name', message: 'Name too large' }],
      },
    })
  );
};
