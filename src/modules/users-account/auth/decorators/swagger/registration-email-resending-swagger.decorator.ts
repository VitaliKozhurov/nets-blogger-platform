import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { RegistrationEmailResendingRequestDto } from '../../api/dto/registration-email-resending.dto';

export const RegistrationEmailResendingSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend registration confirmation email',
      description:
        'Resend email confirmation link to the user if the previous one expired or was not received.',
    }),
    ApiBody({
      type: RegistrationEmailResendingRequestDto,
      description: 'User email address for confirmation resend',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Returns 204 when confirmation email is successfully resent.',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Returns when email is invalid, already confirmed, or user does not exist.',
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
