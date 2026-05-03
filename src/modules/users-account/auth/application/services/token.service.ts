import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants/injection-tokens';
import type { RefreshTokenPayload } from '../../guards/bearer-auth/refresh-token.payload';

@Injectable()
export class TokenService {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwtService: JwtService
  ) {}

  async createAccessToken(dto: { userId: string; login: string; email: string }) {
    const accessToken = await this.accessJwtService.signAsync(dto);

    return accessToken;
  }

  async createRefreshToken(dto: { userId: string; deviceId: string; login: string }) {
    const refreshToken = await this.refreshJwtService.signAsync(dto);

    return refreshToken;
  }

  async createRefreshTokenWithMeta(dto: { userId: string; deviceId: string; login: string }) {
    const refreshToken = await this.createRefreshToken(dto);
    const decoded = this.refreshJwtService.decode(refreshToken) as RefreshTokenPayload | null;

    if (!decoded?.iat || !decoded?.exp || !decoded?.deviceId) {
      return null;
    }

    return {
      refreshToken,
      deviceId: decoded.deviceId,
      iat: decoded.iat,
      expirationAt: decoded.exp,
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.refreshJwtService.verifyAsync<RefreshTokenPayload>(token);

      return payload;
    } catch {
      return null;
    }
  }
}
