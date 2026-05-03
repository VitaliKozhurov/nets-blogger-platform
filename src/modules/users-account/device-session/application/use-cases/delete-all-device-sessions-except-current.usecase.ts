import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceSessionsRepository } from '../../repository';
import { TokenService } from 'src/modules/users-account/auth';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteAllDeviceSessionsExceptCurrentCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteAllDeviceSessionsExceptCurrentCommand)
export class DeleteAllDeviceSessionsExceptCurrentUseCase implements ICommandHandler<DeleteAllDeviceSessionsExceptCurrentCommand> {
  constructor(
    private tokenService: TokenService,
    private deviceSessionRepository: DeviceSessionsRepository
  ) {}

  async execute({ refreshToken }: DeleteAllDeviceSessionsExceptCurrentCommand): Promise<boolean> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    await this.deviceSessionRepository.deleteAllSessionsExceptCurrent(tokenData.deviceId);

    return true;
  }
}
