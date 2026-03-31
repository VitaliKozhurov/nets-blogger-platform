import { CreateUserRequestDto } from './../dto/users/create-user-request.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/users/user-response.dto';

export const CreateUserSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description:
        'Creates a new user account with the provided information. Returns the created user data.',
    }),
    ApiBody({
      type: CreateUserRequestDto,
      description: 'User registration data including email, password, and profile information',
    }),
    ApiCreatedResponse({
      type: UserResponseDto,
      description: 'Returns the newly created user',
    })
  );
};
