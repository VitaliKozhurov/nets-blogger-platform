import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ILoginDto } from '../dto/login.dto';
import { randomUUID } from 'crypto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DeviceSessionsRepository } from '../../../device-session/repository/device-sessions.repository';
import { UsersService } from '../../../users/application/services/users.service';
import { TokenService } from '../services/token.service';
import { UserDeviceSessionEntity } from 'src/modules/users-account/device-session/domain/user-device-session.entity';

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

    const newDeviceId = randomUUID();
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshTokenWithMeta = await this.tokenService.createRefreshTokenWithMeta({
      ...user,
      deviceId: newDeviceId,
    });

    if (!refreshTokenWithMeta) {
      throw new DomainException({
        code: DomainExceptionCode.INTERNAL_SERVER_ERROR,
        message: 'Cannot create refresh token',
      });
    }

    const { iat, expirationAt, deviceId, refreshToken } = refreshTokenWithMeta;

    const session = UserDeviceSessionEntity.createNewSession({
      userId: user.userId,
      deviceId,
      deviceName: dto.deviceName,
      ip: dto.ip,
      iat,
      expirationAt,
    });

    await this.deviceSessionsRepository.save(session);

    return { accessToken, refreshToken };
  }
}
