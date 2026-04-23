import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { TokenService } from '../services';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceSession, DeviceSessionsRepository } from '../../../device-session';

export class LogoutCommand extends Command<void> {
  constructor(public refreshToken: string) {
    super();
  }
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    @InjectModel(DeviceSession.name)
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

    const session = await this.deviceSessionsRepository.findSession({
      userId,
      deviceId,
      iat,
    });

    if (session) {
      await session.deleteSession();
    }
  }
}
