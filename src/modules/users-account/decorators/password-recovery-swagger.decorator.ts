import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PasswordRecoveryDocumentationDto } from '../dto/doc/auth.doc';

export const PasswordRecoverySwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Password recovery request',
      description:
        'Sends password recovery instruction to the specified email address if it exists in the system.',
    }),
    ApiBody({
      type: PasswordRecoveryDocumentationDto,
      description: 'User email for password recovery',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Always returns 204 even if email is not registered (to prevent email enumeration attacks).',
    }),
    // TODO add example with errors
    ApiBadRequestResponse({
      description: 'Returns when the request body has invalid values (e.g., invalid email format)',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
