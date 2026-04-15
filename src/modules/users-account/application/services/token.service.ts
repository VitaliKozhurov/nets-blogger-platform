import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    @Inject('ACCESS_TOKEN_STRATEGY_INJECT_TOKEN')
    private jwtService: JwtService
    // private readonly configService: ConfigService
  ) {}

  async createAccessToken(dto: { userId: string; login: string }) {
    // const secret = this.configService.getOrThrow<string>(EnvVariables.JWT_ACCESS_TOKEN_SECRET);
    // const expiresIn = this.configService.getOrThrow<number>(EnvVariables.JWT_ACCESS_TOKEN_TTL);

    const accessToken = await this.jwtService.signAsync(dto);

    return accessToken;
  }
}
