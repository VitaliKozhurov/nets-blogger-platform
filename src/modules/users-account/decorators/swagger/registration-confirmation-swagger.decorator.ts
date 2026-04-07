import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationConfirmationDocumentationDto } from '../../dto/doc/auth.doc';

export const RegistrationConfirmationSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm email registration',
      description:
        'Confirms user email address using the confirmation code sent during registration.',
    }),
    ApiBody({
      type: RegistrationConfirmationDocumentationDto,
      description: 'Email confirmation code',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Returns 204 when email is successfully confirmed.',
    }),
    // TODO add example with errors
    ApiBadRequestResponse({
      description: 'Returns when the confirmation code is invalid, expired, or already used.',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
