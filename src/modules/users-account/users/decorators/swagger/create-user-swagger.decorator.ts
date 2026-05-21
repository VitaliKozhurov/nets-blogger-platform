import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserRequestDto } from '../../api/dto/create-user.dto';
import { UserResponseDto } from '../../api/dto/user-response.dto';

export const CreateUserByAdminSwagger = () => {
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
