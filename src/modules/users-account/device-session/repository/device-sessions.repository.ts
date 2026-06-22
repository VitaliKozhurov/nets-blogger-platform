import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateSessionParamsDto } from './dto/update-session.params.dto';
import { IDeleteSessionParamsDto } from './dto/delete-session.params.dto';
import { UserDeviceSessionEntity } from '../domain/user-device-session.entity';

@Injectable()
export class DeviceSessionsRepository {
  constructor(
    @InjectRepository(UserDeviceSessionEntity)
    private userDeviceSessionsRepo: Repository<UserDeviceSessionEntity>
  ) {}

  async save(deviceSession: UserDeviceSessionEntity) {
    return this.userDeviceSessionsRepo.save(deviceSession);
  }

  async updateSession(dto: IUpdateSessionParamsDto) {
    const { userId, deviceId, iat, newIat, newExpirationAt } = dto;

    const { affected } = await this.userDeviceSessionsRepo.update(
      { userId, deviceId, iat },
      { iat: newIat, expirationAt: newExpirationAt }
    );

    return affected === 1;
  }

  async deleteSession(dto: IDeleteSessionParamsDto) {
    const { userId, deviceId, iat } = dto;

    const { affected } = await this.userDeviceSessionsRepo.delete({
      userId,
      deviceId,
      iat,
    });

    return affected === 1;
  }

  async deleteAllUserSessionsExceptCurrent(dto: { userId: string; deviceId: string }) {
    const { userId, deviceId } = dto;

    const { affected } = await this.userDeviceSessionsRepo.delete({
      userId,
      deviceId: Not(deviceId),
    });

    return affected && affected > 0;
  }

  async findByIdOrThrow(deviceId: string): Promise<UserDeviceSessionEntity> {
    const session = await this.userDeviceSessionsRepo.findOne({
      where: { deviceId },
    });

    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Session not found',
      });
    }

    return session;
  }
}
