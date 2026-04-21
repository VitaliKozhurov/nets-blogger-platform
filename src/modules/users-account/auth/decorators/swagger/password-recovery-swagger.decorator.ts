import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { PasswordRecoveryRequestDto } from '../../api/dto';

export const PasswordRecoverySwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Password recovery request',
      description:
        'Sends password recovery instruction to the specified email address if it exists in the system.',
    }),
    ApiBody({
      type: PasswordRecoveryRequestDto,
      description: 'User email for password recovery',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Always returns 204 even if email is not registered (to prevent email enumeration attacks).',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Returns when the request body has invalid values (e.g., invalid email format)',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'email', message: 'Error message' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
