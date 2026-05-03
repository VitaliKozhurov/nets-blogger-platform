import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { RegistrationConfirmationRequestDto } from '../../api/dto/registration-confirmation.dto';

export const RegistrationConfirmationSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm email registration',
      description:
        'Confirms user email address using the confirmation code sent during registration.',
    }),
    ApiBody({
      type: RegistrationConfirmationRequestDto,
      description: 'Email confirmation code',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Returns 204 when email is successfully confirmed.',
    }),

    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Returns when the confirmation code is invalid, expired, or already used.',
      example: {
        code: 'Error code',
        message: 'Error message',
        extensions: [{ field: 'code', message: 'Error message' }],
      },
    }),
    ApiErrorResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
