import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MeResponseDocumentationDto } from '../dto/doc/auth.doc';

export const MeSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current user information',
      description: 'Returns authenticated user profile data (email, login, userId).',
    }),
    ApiOkResponse({
      type: MeResponseDocumentationDto,
      description: 'Returns user data when authentication token is valid.',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    })
  );
};
