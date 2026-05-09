import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { DataSource } from 'typeorm';

export class DeviceSessionTestUtil {
  constructor(
    private readonly app: NestExpressApplication,
    private readonly dataSource: DataSource
  ) {}

  getAllSessions() {
    return this.dataSource.query(`
      SELECT *
      FROM "user_device_sessions"
    `);
  }

  getDeviceSessionsByRefreshToken(refreshToken: string) {
    return request(this.app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', `refreshToken=${refreshToken}`);
  }
}
