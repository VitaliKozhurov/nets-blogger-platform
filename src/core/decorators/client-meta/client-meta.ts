import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type ClientMetaDto = {
  ip: string;
  deviceName: string;
};

export const ClientMeta = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ClientMetaDto => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const headerDevice = request.headers['x-device-name'];
    const userAgent = request.headers['user-agent'];

    const deviceName =
      (Array.isArray(headerDevice) ? headerDevice[0] : headerDevice) ||
      (Array.isArray(userAgent) ? userAgent[0] : userAgent) ||
      'unknown-device';

    const ip = request.ip || request.socket.remoteAddress || 'unknown-ip';

    return { ip, deviceName };
  }
);
