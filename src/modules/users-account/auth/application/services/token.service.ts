import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from 'src/core/tokens';

@Injectable()
export class TokenService {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwtService: JwtService
  ) {}

  async createAccessToken(dto: { userId: string; login: string }) {
    const accessToken = await this.accessJwtService.signAsync(dto);

    return accessToken;
  }

  async createRefreshToken(dto: { userId: string; login: string }) {
    const refreshToken = await this.refreshJwtService.signAsync(dto);

    return refreshToken;
  }
}
