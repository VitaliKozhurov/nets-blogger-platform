import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { UsersRepository } from 'src/modules/users-account/users';
import { DeviceSessionsRepository } from '../../../device-session';
import { TokenService } from '../services';

type RefreshTokenResult = {
  accessToken: string;
  refreshToken: string;
};

export class RefreshTokenCommand extends Command<RefreshTokenResult> {
  constructor(public refreshToken: string) {
    super();
  }
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private tokenService: TokenService,
    private usersRepository: UsersRepository,
    private deviceSessionsRepository: DeviceSessionsRepository
  ) {}

  async execute({ refreshToken }: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      this.throwUnauthorized();
    }

    const { userId, deviceId, iat } = tokenData;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      this.throwUnauthorized();
    }

    const session = await this.deviceSessionsRepository.findSession({
      userId,
      deviceId,
      iat,
    });

    if (!session) {
      this.throwUnauthorized();
    }

    const accessToken = await this.tokenService.createAccessToken({
      userId,
      login: user.login,
      email: user.email,
    });

    const refreshTokenWithMeta = await this.tokenService.createRefreshTokenWithMeta({
      userId,
      login: user.login,
      deviceId,
    });

    if (!refreshTokenWithMeta) {
      this.throwUnauthorized();
    }

    session.updateSession({
      iat: refreshTokenWithMeta.iat,
      expirationAt: refreshTokenWithMeta.expirationAt,
    });

    await this.deviceSessionsRepository.save(session);

    return { accessToken, refreshToken: refreshTokenWithMeta.refreshToken };
  }

  private throwUnauthorized(): never {
    throw new DomainException({
      code: DomainExceptionCode.UNAUTHORIZED_ERROR,
      message: 'Unauthorized',
    });
  }
}
