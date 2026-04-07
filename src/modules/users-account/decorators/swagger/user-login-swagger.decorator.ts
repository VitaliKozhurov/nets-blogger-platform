import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UserLoginDocumentationDto,
  UserLoginResponseDocumentationDto,
} from '../../dto/doc/auth.doc';

export const UserLoginSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description:
        'Creates a new user account with the provided information. Returns the created user data.',
    }),
    ApiBody({
      type: UserLoginDocumentationDto,
      description: 'User registration data including email, password, and profile information',
    }),
    ApiCreatedResponse({
      type: UserLoginResponseDocumentationDto,
      description: 'Returns the newly created user',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
    }),
    ApiUnauthorizedResponse({
      description: 'If the password or login or email is wrong',
    })
  );
};
