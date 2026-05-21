import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICreateSessionParamsDto } from './dto/create-session.params.dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { IUpdateSessionParamsDto } from './dto/update-session.params.dto';
import { IDeleteSessionParamsDto } from './dto/delete-session.params.dto';
import { IDeviceSessionEntityDto } from '../domain/dto';

@Injectable()
export class DeviceSessionsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

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

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      DELETE FROM "user_device_sessions"
        WHERE "userId" = $1 AND "deviceId" = $2 AND iat = $3
        RETURNING id
      `,
      [userId, deviceId, iat]
    );

    return rows.length > 0;
  }

  async deleteAllUserSessionsExceptCurrent(dto: { userId: string; deviceId: string }) {
    const { userId, deviceId } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      DELETE FROM "user_device_sessions"
        WHERE "userId" = $1 AND "deviceId" != $2
        RETURNING id
      `,
      [userId, deviceId]
    );

    return rows.length > 0;
  }

  async findByIdOrThrow(deviceId: string): Promise<IDeviceSessionEntityDto> {
    const [session]: IDeviceSessionEntityDto[] = await this.dataSource.query(
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
