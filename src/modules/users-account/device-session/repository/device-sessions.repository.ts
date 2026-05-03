import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICreateSessionDto } from './dto/create-session.dto';
import { IDeviceSessionRepositoryDto } from './dto/device-session-repository.dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

@Injectable()
export class DeviceSessionsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createSession(dto: ICreateSessionDto) {
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

  async updateSession(dto: {
    userId: string;
    deviceId: string;
    iat: number;
    newIat: number;
    newExpirationAt: number;
  }) {
    const { userId, deviceId, iat, newIat, newExpirationAt } = dto;

    const result: { id: string }[] = await this.dataSource.query(
      `
      UPDATE "user_device_sessions"
        SET iat = $4, "expirationAt" = $5
        WHERE "userId" = $1 AND "deviceId" = $2 AND iat = $3
        RETURNING id
      `,
      [userId, deviceId, iat, newIat, newExpirationAt]
    );

    return result.length > 0;
  }

  async deleteSession(dto: { userId: string; deviceId: string; iat: number }) {
    const { userId, deviceId, iat } = dto;

    const result: { id: string }[] = await this.dataSource.query(
      `
      DELETE FROM "user_device_sessions"
        WHERE "userId" = $1 AND "deviceId" = $2 AND iat = $3
        RETURNING id
      `,
      [userId, deviceId, iat]
    );

    return result.length > 0;
  }

  async deleteAllSessionsExceptCurrent(deviceId: string) {
    const result: { id: string }[] = await this.dataSource.query(
      `
      DELETE FROM "user_device_sessions"
        WHERE "deviceId" != $1
        RETURNING id
      `,
      [deviceId]
    );

    return result.length > 0;
  }

  async findByIdOrThrow(deviceId: string): Promise<IDeviceSessionRepositoryDto> {
    const [session]: IDeviceSessionRepositoryDto[] = await this.dataSource.query(
      `
      SELECT * 
        FROM "user_device_sessions"
        WHERE "deviceId" = $1
      `,
      [deviceId]
    );

    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Session not found',
      });
    }

    return session;
  }
}
