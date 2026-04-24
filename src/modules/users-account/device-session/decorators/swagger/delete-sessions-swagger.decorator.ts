import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';

export const DeleteSessionsSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user device sessions',
      description: 'Permanently delete a user device sessions except the current one.',
    }),
    ApiCookieAuth('refreshToken'),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'User device sessions successfully deleted. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or missing refresh token.',
    })
  );
};
