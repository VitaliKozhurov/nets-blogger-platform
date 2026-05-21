import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IDeviceSessionEntityDto } from '../domain/dto';

@Injectable()
export class DeviceSessionsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAllByUser(userId: string) {
    const sessions: IDeviceSessionEntityDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM "user_device_sessions"
            WHERE "userId" = $1
      `,
      [userId]
    );

    return sessions;
  }
}
