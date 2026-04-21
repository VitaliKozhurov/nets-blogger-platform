import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { RegistrationRequestDto } from '../../api/dto';

export const RegistrationSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User registration',
      description: 'Registers a new user with login, password, and email address.',
    }),
    ApiBody({
      type: RegistrationRequestDto,
      description: 'User registration data (login, password, email)',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Returns 204 when user is successfully registered.',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      example: {
        code: 'User registration error',
        message: 'User with login already exists',
        extensions: [{ field: 'login', message: 'User with login already exists' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
