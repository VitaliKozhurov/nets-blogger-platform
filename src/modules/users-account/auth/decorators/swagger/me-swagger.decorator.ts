import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MeResponseDto } from '../../api/dto/me.dto';

export const MeSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current user information',
      description: 'Returns authenticated user profile data (email, login, userId).',
    }),
    ApiOkResponse({
      type: MeResponseDto,
      description: 'Returns user data when authentication token is valid.',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    })
  );
};
