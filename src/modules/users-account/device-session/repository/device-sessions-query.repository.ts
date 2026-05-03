import { Injectable } from '@nestjs/common';
import { DeviceSessionMapperDto } from '../api/dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IDeviceSessionRepositoryDto } from './dto/device-session-repository.dto';

@Injectable()
export class DeviceSessionsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAllByUser(userId: string) {
    const sessions: IDeviceSessionRepositoryDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM "user_device_sessions"
            WHERE "userId" = $1
      `,
      [userId]
    );

    return sessions.map(DeviceSessionMapperDto.mapToView);
  }
}
