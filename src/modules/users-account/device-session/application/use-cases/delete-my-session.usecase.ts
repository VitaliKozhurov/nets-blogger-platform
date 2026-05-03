import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceSessionsRepository } from '../../repository';
import { TokenService } from 'src/modules/users-account/auth';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class DeleteMyDeviceSessionCommand {
  constructor(public dto: { deviceId: string; refreshToken: string }) {}
}

@CommandHandler(DeleteMyDeviceSessionCommand)
export class DeleteMyDeviceSessionUseCase implements ICommandHandler<DeleteMyDeviceSessionCommand> {
  constructor(
    private tokenService: TokenService,
    private deviceSessionRepository: DeviceSessionsRepository
  ) {}

  async execute({ dto }: DeleteMyDeviceSessionCommand): Promise<boolean> {
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
