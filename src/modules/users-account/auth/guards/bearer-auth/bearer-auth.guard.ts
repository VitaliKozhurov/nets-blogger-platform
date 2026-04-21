import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../constants/injection-tokens';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { AccessTokenPayload } from './access-token.payload';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/core/guards';
import { UsersAccountConfig } from '../../../config/users-account-config';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: UsersAccountConfig
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    try {
      const secret = this.configService.jwtAccessTokenSecret;

      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, { secret });

      request.user = payload;
    } catch {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
