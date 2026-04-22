import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../constants/injection-tokens';
import { UsersAccountConfig } from '../config/users-account-config';

export const jwtConfigProviders = [
  {
    provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (configService: UsersAccountConfig): JwtService => {
      const secret = configService.jwtAccessTokenSecret;
      const expiresIn = configService.jwtAccessTokenExpiration as JwtSignOptions['expiresIn'];

      return new JwtService({
        secret,
        signOptions: { expiresIn },
      });
    },
    inject: [UsersAccountConfig],
  },
  {
    provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (configService: UsersAccountConfig): JwtService => {
      const secret = configService.jwtRefreshTokenSecret;
      const expiresIn = configService.jwtRefreshTokenExpiration as JwtSignOptions['expiresIn'];

      return new JwtService({
        secret,
        signOptions: { expiresIn },
      });
    },
    inject: [UsersAccountConfig],
  },
];
