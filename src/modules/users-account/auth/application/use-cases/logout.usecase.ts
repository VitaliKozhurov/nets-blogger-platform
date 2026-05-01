import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DeviceSessionsRepository } from '../../../device-session';
import { TokenService } from '../services';

export class LogoutCommand extends Command<void> {
  constructor(public refreshToken: string) {
    super();
  }
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private tokenService: TokenService,
    private deviceSessionsRepository: DeviceSessionsRepository
  ) {}

  async execute({ refreshToken }: LogoutCommand): Promise<void> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    const { userId, deviceId, iat } = tokenData;

    const isDeleting = await this.deviceSessionsRepository.deleteSession({
      userId,
      deviceId,
      iat,
    });

    if (!isDeleting) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }
  }
}
