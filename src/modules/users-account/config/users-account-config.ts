import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { EnvVariables } from 'src/core/types/env.interface';
import { configValidationUtility } from 'src/core/utils';

@Injectable()
export class UsersAccountConfig {
  constructor(private configService: ConfigService<unknown, true>) {
    this.jwtAccessTokenSecret = this.configService.get(EnvVariables.JWT_ACCESS_TOKEN_SECRET);

    this.jwtRefreshTokenSecret = this.configService.get(EnvVariables.JWT_REFRESH_TOKEN_SECRET);

    this.jwtAccessTokenExpiration = this.configService.get(EnvVariables.JWT_ACCESS_TOKEN_TTL);

    this.jwtRefreshTokenExpiration = this.configService.get(EnvVariables.JWT_REFRESH_TOKEN_TTL);

    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: `Should set secret string for access token`,
  })
  jwtAccessTokenSecret: string;

  @IsNotEmpty({
    message: `Should set secret string for refresh token`,
  })
  jwtRefreshTokenSecret: string;

  @IsNotEmpty({
    message: `Should set expiration time for access token`,
  })
  jwtAccessTokenExpiration: string;

  @IsNotEmpty({
    message: `Should set expiration time for refresh token`,
  })
  jwtRefreshTokenExpiration: string;
}
