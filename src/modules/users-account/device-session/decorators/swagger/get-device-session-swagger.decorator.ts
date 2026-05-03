import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';
import { DeviceSessionResponseDto } from '../../api/dto/device-session-response.dto';

export const GetDeviceSessionsSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User device sessions',
      description: 'Get user device sessions.',
    }),
    ApiCookieAuth('refreshToken'),
    ApiOkResponse({
      type: [DeviceSessionResponseDto],
      description: 'Get array of devices.',
    }),
    ApiErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or missing refresh token.',
    })
  );
};
