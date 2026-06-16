import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ICreateSessionParamsDto } from './dto/create-session.params.dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateSessionParamsDto } from './dto/update-session.params.dto';
import { IDeleteSessionParamsDto } from './dto/delete-session.params.dto';
import { UserDeviceSessionEntity } from '../domain/user-device-session.entity';

@Injectable()
export class DeviceSessionsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UserDeviceSessionEntity)
    private userDeviceSessionsRepo: Repository<UserDeviceSessionEntity>
  ) {}

  async createSession(dto: ICreateSessionParamsDto) {
    const { userId, deviceId, deviceName, ip, iat, expirationAt } = dto;

    await this.dataSource.query(
      `
      INSERT INTO "user_device_sessions"
        ("userId", "deviceId", "deviceName", ip, iat, "expirationAt")
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [userId, deviceId, deviceName, ip, iat, expirationAt]
    );
  }

  async updateSession(dto: IUpdateSessionParamsDto) {
    const { userId, deviceId, iat, newIat, newExpirationAt } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      UPDATE "user_device_sessions"
        SET iat = $4, "expirationAt" = $5
        WHERE "userId" = $1 AND "deviceId" = $2 AND iat = $3
        RETURNING id
      `,
      [userId, deviceId, iat, newIat, newExpirationAt]
    );

    return rows.length > 0;
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

    const { affected } = await this.userDeviceSessionsRepo.delete({ userId, deviceId });

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
