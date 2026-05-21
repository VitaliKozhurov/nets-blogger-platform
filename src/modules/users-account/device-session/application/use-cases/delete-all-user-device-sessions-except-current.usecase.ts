import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../../../auth/application/services/token.service';
import { DeviceSessionsRepository } from '../../repository/device-sessions.repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteAllUserDeviceSessionsExceptCurrentCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteAllUserDeviceSessionsExceptCurrentCommand)
export class DeleteAllUserDeviceSessionsExceptCurrentUseCase implements ICommandHandler<DeleteAllUserDeviceSessionsExceptCurrentCommand> {
  constructor(
    private tokenService: TokenService,
    private deviceSessionRepository: DeviceSessionsRepository
  ) {}

  async execute({ refreshToken }: DeleteAllUserDeviceSessionsExceptCurrentCommand): Promise<boolean> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    await this.deviceSessionRepository.deleteAllUserSessionsExceptCurrent({
      userId: tokenData.userId,
      deviceId: tokenData.deviceId,
    });

    return true;
  }
}
