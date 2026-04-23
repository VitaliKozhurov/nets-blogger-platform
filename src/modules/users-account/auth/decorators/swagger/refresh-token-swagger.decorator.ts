import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { RefreshTokenResponseDto } from '../../api/dto';

export const RefreshTokenSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User update tokens',
      description: 'Update access and refresh tokens.',
    }),
    ApiCookieAuth('refreshToken'),
    ApiOkResponse({
      type: RefreshTokenResponseDto,
      description: 'Returns JWT access token.',
      headers: {
        'Set-Cookie': {
          description: 'HttpOnly refresh token cookie',
          schema: {
            type: 'string',
            example: 'refreshToken=eyJ...; Path=/; HttpOnly; Secure; SameSite=Strict',
          },
        },
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If refresh token is incorrect.',
    })
  );
};
