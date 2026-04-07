import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewPasswordDocumentationDto } from '../../dto/doc/auth.doc';

export const NewPasswordSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Set new password',
      description: 'Sets a new password for the user using the recovery code sent via email.',
    }),
    ApiBody({
      type: NewPasswordDocumentationDto,
      description: 'New password and recovery code',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'If code is valid and new password is accepted.',
    }),
    // TODO add example with errors
    ApiBadRequestResponse({
      description:
        'Returns when the request body has invalid values (e.g., password too short, invalid recovery code format)',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description:
        'Rate limit exceeded: more than 5 attempts from one IP address within 10 seconds',
    })
  );
};
