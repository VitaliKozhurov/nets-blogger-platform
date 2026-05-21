import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { TokenService } from '../../../auth/application/services/token.service';
import { DeviceSessionMapperDto } from '../dto/device-session.mapper';
import { DeviceSessionsQueryRepository } from '../../repository/device-sessions-query.repository';

export class GetDeviceSessionsQuery extends Query<DeviceSessionMapperDto[]> {
  constructor(public refreshToken: string) {
    super();
  }
}

@QueryHandler(GetDeviceSessionsQuery)
export class GetDeviceSessionsHandler implements IQueryHandler<GetDeviceSessionsQuery> {
  constructor(
    private tokenService: TokenService,
    private readonly deviceSessionsQueryRepository: DeviceSessionsQueryRepository
  ) {}

  async execute({ refreshToken }: GetDeviceSessionsQuery) {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!tokenData) {
      throw new DomainException({
        code: DomainExceptionCode.UNAUTHORIZED_ERROR,
        message: 'Unauthorized',
      });
    }

    const sessions = await this.deviceSessionsQueryRepository.findAllByUser(tokenData.userId);

    return sessions.map(DeviceSessionMapperDto.mapToView);
  }
}
