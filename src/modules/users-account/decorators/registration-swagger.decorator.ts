import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationDocumentationDto } from '../dto/doc/auth.doc';

export const RegistrationSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User registration',
      description: 'Registers a new user with login, password, and email address.',
    }),
    ApiBody({
      type: RegistrationDocumentationDto,
      description: 'User registration data (login, password, email)',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Returns 204 when user is successfully registered.',
    }),
    // TODO add example with errors
    ApiBadRequestResponse({
      description:
        'Returns when request body has invalid values (e.g., login already exists, invalid email format, weak password).',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
