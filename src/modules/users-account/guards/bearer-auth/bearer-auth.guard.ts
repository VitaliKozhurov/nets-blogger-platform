import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.getAuthToken(request);

    // TODO add domain exception
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = {};

      //   const payload = await this.jwtService.verifyAsync(token);
      // implement jwt check
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }

  private getAuthToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
