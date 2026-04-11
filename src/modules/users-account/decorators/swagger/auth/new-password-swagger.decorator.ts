import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { NewPasswordRequestDto } from '../../../api/dto/auth/new-password.dto';

export const NewPasswordSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Set new password',
      description: 'Sets a new password for the user using the recovery code sent via email.',
    }),
    ApiBody({
      type: NewPasswordRequestDto,
      description: 'New password and recovery code',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'If code is valid and new password is accepted.',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Returns when the request body has invalid values (e.g., password too short, invalid recovery code format)',
    }),
    ApiErrorResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
