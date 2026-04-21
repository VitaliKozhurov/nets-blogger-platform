import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IS_PUBLIC_KEY } from 'src/core/guards';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = 'admin';
  private readonly validPassword = 'qwerty';

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic')) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized error',
      });
    }

    const credentials = authorizationHeader.split(' ')[1];
    const originalBase64Credentials = btoa(`${this.validUsername}:${this.validPassword}`);

    if (credentials !== originalBase64Credentials) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized error',
      });
    }

    return true;
  }
}
