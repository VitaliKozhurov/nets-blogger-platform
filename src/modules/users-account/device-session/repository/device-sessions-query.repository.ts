import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceSession, type DeviceSessionModelType } from '../domain';
import { DeviceSessionMapperDto } from '../api/dto';

@Injectable()
export class DeviceSessionsQueryRepository {
  constructor(
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType
  ) {}

  async findAll() {
    const sessions = await this.DeviceSessionModel.find().lean().exec();

    return sessions.map(DeviceSessionMapperDto.mapToView);
  }
}
