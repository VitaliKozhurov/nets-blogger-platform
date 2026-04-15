import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ILoginDto } from '../../dto/auth/login.dto';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';

export class LoginCommand {
  constructor(public dto: ILoginDto) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService
  ) {}

  async execute({ dto }: LoginCommand): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.validateUser(dto);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return { accessToken, refreshToken };
  }
}
