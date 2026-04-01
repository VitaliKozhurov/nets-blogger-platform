import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(
    loginOrEmail: string,
    password: string
  ): Promise<{
    userId: string;
    login: string;
  }> {
    const user = await this.authService.validateUser({ loginOrEmail, password });

    // TODO add domain exception
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
