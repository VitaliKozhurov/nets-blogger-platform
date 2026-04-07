import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDocumentationDto, UserResponseDocumentationDto } from '../../dto/doc/user.doc';

export const CreateUserSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description:
        'Creates a new user account with the provided information. Returns the created user data.',
    }),
    ApiBody({
      type: CreateUserDocumentationDto,
      description: 'User registration data including email, password, and profile information',
    }),
    ApiCreatedResponse({
      type: UserResponseDocumentationDto,
      description: 'Returns the newly created user',
    })
  );
};
