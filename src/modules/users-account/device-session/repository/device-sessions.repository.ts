import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceSession, DeviceSessionDocument, type DeviceSessionModelType } from '../domain';

@Injectable()
export class DeviceSessionsRepository {
  constructor(
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType
  ) {}

  async save(deviceSessionDocument: DeviceSessionDocument) {
    await deviceSessionDocument.save();
  }
}
