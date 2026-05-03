import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceSessionsRepository } from '../../repository';
import { TokenService } from 'src/modules/users-account/auth';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteCurrentDeviceSessionCommand {
  constructor(public dto: { deviceId: string; refreshToken: string }) {}
}

@CommandHandler(DeleteCurrentDeviceSessionCommand)
export class DeleteCurrentDeviceSessionUseCase implements ICommandHandler<DeleteCurrentDeviceSessionCommand> {
  constructor(
    private tokenService: TokenService,
    private deviceSessionRepository: DeviceSessionsRepository
  ) {}

  async execute({ dto }: DeleteCurrentDeviceSessionCommand): Promise<boolean> {
    const { deviceId, refreshToken } = dto;

    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    const deviceSession = await this.deviceSessionRepository.findByIdOrThrow(deviceId);

    if (tokenData.userId !== deviceSession.userId) {
      throw new DomainException({
        code: DomainExceptionCode.FORBIDDEN_ERROR,
        message: 'Not enough permissions',
      });
    }

    await this.deviceSessionRepository.deleteSession({
      deviceId: deviceSession.deviceId,
      userId: deviceSession.userId,
      iat: deviceSession.iat,
    });

    return true;
  }
}
