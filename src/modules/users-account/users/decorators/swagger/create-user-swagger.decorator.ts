import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserByAdminRequestDto } from '@modules/users-account/users/api/dto';
import { UserResponseDto } from '../../api/dto';

export const CreateUserByAdminSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description:
        'Creates a new user account with the provided information. Returns the created user data.',
    }),
    ApiBody({
      type: CreateUserByAdminRequestDto,
      description: 'User registration data including email, password, and profile information',
    }),
    ApiCreatedResponse({
      type: UserResponseDto,
      description: 'Returns the newly created user',
    })
  );
};
