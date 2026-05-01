import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { DeviceSession, DeviceSessionDocument, type DeviceSessionModelType } from '../domain';
import { ICreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class DeviceSessionsRepository {
  constructor(
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

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

  async findSession({ userId, deviceId, iat }: { userId: string; deviceId: string; iat: number }) {
    const currentSession = await this.DeviceSessionModel.findOne({
      userId,
      deviceId,
      iat,
    });

    return currentSession;
  }

  async findByIdOrThrow(deviceId: string) {
    const deviceSession = await this.DeviceSessionModel.findOne({
      deviceId,
    }).exec();

    if (!deviceSession) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Session not found',
      });
    }

    return deviceSession;
  }

  async deleteSessionsExceptTheCurrent(deviceId: string) {
    await this.DeviceSessionModel.deleteMany({
      deviceId: { $ne: deviceId },
    });
  }

  async save(deviceSessionDocument: DeviceSessionDocument) {
    await deviceSessionDocument.save();
  }
}
