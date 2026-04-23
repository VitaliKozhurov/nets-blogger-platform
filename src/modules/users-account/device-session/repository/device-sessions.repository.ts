import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceSession, DeviceSessionDocument, type DeviceSessionModelType } from '../domain';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

@Injectable()
export class DeviceSessionsRepository {
  constructor(
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType
  ) {}

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
