import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ILoginDto } from '../dto';

import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { TokenService } from '../services';
import { UsersService } from '../../../users/application/services';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeviceSession,
  DeviceSessionsRepository,
  type DeviceSessionModelType,
} from '../../../device-session';
import { randomUUID } from 'crypto';

type LoginResult = {
  accessToken: string;
  refreshToken: string;
};

export class LoginCommand extends Command<LoginResult> {
  constructor(public dto: ILoginDto) {
    super();
  }
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType,
    private usersService: UsersService,
    private tokenService: TokenService,
    private deviceSessionsRepository: DeviceSessionsRepository
  ) {}

  async execute({ dto }: LoginCommand): Promise<LoginResult> {
    const user = await this.usersService.validateUser(dto);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    const deviceId = randomUUID();

    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshTokenWithMeta = await this.tokenService.createRefreshTokenWithMeta({
      ...user,
      deviceId,
    });

    if (!refreshTokenWithMeta) {
      throw new DomainException({
        code: DomainExceptionCode.INTERNAL_SERVER_ERROR,
        message: 'Cannot create refresh token',
      });
    }

    const { iat, expirationAt, refreshToken } = refreshTokenWithMeta;

    const deviceSession = await this.DeviceSessionModel.createDeviceSessionInstance({
      userId: user.userId,
      deviceId,
      ip: dto.ip,
      deviceName: dto.deviceName,
      iat,
      expirationAt,
    });

    await this.deviceSessionsRepository.save(deviceSession);

    return { accessToken, refreshToken };
  }
}
