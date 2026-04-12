import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ILoginDto } from '../dto/auth/login.dto';
import { AuthService } from '../auth.service';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { TokenService } from '../token.service';

export class LoginCommand {
  constructor(public dto: ILoginDto) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  async execute({ dto }: LoginCommand): Promise<{ accessToken: string }> {
    const user = await this.authService.validateUser(dto);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }
    const accessToken = await this.tokenService.createAccessToken(user);

    return { accessToken };
  }
}
