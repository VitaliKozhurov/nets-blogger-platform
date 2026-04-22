import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type ClientMetaDto = {
  ip: string;
  deviceName: string;
};

export const ClientMeta = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ClientMetaDto => {
    const request = ctx.switchToHttp().getRequest();

    const headerDevice = request.headers['x-device-name'];
    const userAgent = request.headers['user-agent'];
    const forwardedFor = request.headers['x-forwarded-for'];

    const deviceName =
      (Array.isArray(headerDevice) ? headerDevice[0] : headerDevice) ||
      (Array.isArray(userAgent) ? userAgent[0] : userAgent) ||
      'unknown-device';

    const ip =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim() ||
      request.ip ||
      'unknown-ip';

    return { ip, deviceName };
  }
);
