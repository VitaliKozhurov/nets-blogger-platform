import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';

export const DeleteSessionSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user device session',
      description: 'Permanently delete a user device session.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the user device session',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiCookieAuth('refreshToken'),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'User device session successfully deleted. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or missing refresh token.',
    })
  );
};
