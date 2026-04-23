import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceSessionsRepository } from '../../repository';
import { TokenService } from 'src/modules/users-account/auth';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteAllMyDeviceSessionWithoutCurrentCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteAllMyDeviceSessionWithoutCurrentCommand)
export class DeleteAllMyDeviceSessionWithoutCurrentUseCase implements ICommandHandler<DeleteAllMyDeviceSessionWithoutCurrentCommand> {
  constructor(
    private tokenService: TokenService,
    private deviceSessionRepository: DeviceSessionsRepository
  ) {}

  async execute({ refreshToken }: DeleteAllMyDeviceSessionWithoutCurrentCommand): Promise<boolean> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    await this.deviceSessionRepository.deleteSessionsExceptTheCurrent(tokenData.deviceId);

    return true;
  }
}
