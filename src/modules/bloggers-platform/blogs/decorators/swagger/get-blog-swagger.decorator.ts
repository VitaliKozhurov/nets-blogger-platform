import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { BlogResponseDto } from '../../api/dto';

export const GetBlogSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a blog',
      description: 'Retrieves a blog by its ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the blog to retrieve',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      type: BlogResponseDto,
      description: 'Blog successfully retrieved.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog with the specified ID was not found.',
    })
  );
};
