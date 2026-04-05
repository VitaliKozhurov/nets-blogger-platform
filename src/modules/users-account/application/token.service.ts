import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvVariables } from 'src/config/env.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async createAccessToken(dto: { userId: string; login: string }) {
    const secret = this.configService.getOrThrow<string>(EnvVariables.JWT_ACCESS_TOKEN_SECRET);
    const expiresIn = this.configService.getOrThrow<number>(EnvVariables.JWT_ACCESS_TOKEN_TTL);

    const accessToken = await this.jwtService.signAsync(dto, { secret, expiresIn });

    return accessToken;
  }
}
