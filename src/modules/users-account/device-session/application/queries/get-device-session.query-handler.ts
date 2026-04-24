import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { TokenService } from 'src/modules/users-account/auth';
import { DeviceSessionResponseDto } from '../../api/dto';
import { DeviceSessionsQueryRepository } from '../../repository';

export class GetDeviceSessionsQuery {
  constructor(public refreshToken: string) {}
}

@QueryHandler(GetDeviceSessionsQuery)
export class GetDeviceSessionsHandler implements IQueryHandler<
  GetDeviceSessionsQuery,
  DeviceSessionResponseDto[]
> {
  constructor(
    private tokenService: TokenService,
    private readonly deviceSessionsQueryRepository: DeviceSessionsQueryRepository
  ) {}

  async execute({ refreshToken }: GetDeviceSessionsQuery): Promise<DeviceSessionResponseDto[]> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    console.log('TOKEN: ', tokenData);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    return this.deviceSessionsQueryRepository.findAll();
  }
}
