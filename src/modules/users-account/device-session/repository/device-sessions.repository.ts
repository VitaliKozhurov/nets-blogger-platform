import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceSession, DeviceSessionDocument, type DeviceSessionModelType } from '../domain';

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

  async save(deviceSessionDocument: DeviceSessionDocument) {
    await deviceSessionDocument.save();
  }
}
