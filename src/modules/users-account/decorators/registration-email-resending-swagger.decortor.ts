import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationEmailResendingDocumentationDto } from '../dto/doc/auth.doc';

export const RegistrationEmailResendingSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend registration confirmation email',
      description:
        'Resend email confirmation link to the user if the previous one expired or was not received.',
    }),
    ApiBody({
      type: RegistrationEmailResendingDocumentationDto,
      description: 'User email address for confirmation resend',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Returns 204 when confirmation email is successfully resent.',
    }),
    // TODO add example with errors
    ApiBadRequestResponse({
      description: 'Returns when email is invalid, already confirmed, or user does not exist.',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
