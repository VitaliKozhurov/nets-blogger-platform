import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { LoginRequestDto, LoginResponseDto } from '../../api/dto/auth/login.dto';

export const LoginSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Authenticates a user and returns an access token.',
    }),
    ApiBody({
      type: LoginRequestDto,
      description: 'User login credentials.',
    }),
    ApiOkResponse({
      type: LoginResponseDto,
      description: 'Returns JWT access token.',
    }),
    ApiErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the request body has invalid values.',
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If login/email or password is incorrect.',
    })
  );
};
