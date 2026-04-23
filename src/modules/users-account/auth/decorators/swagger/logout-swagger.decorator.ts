import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth, ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { LoginResponseDto } from '../../api/dto';

export const LogoutSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Logout user',
      description: 'Logout user and remove refresh token.',
    }),
    ApiCookieAuth('refreshToken'),
    ApiNoContentResponse({
      type: LoginResponseDto,
      description: 'Clear refresh token.',
      headers: {
        'Set-Cookie': {
          description: 'Cleared refresh token cookie',
          schema: {
            type: 'string',
            example: 'refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
          },
        },
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or missing refresh token.',
    })
  );
};
