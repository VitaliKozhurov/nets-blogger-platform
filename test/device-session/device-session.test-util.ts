import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { DataSource } from 'typeorm';

export class DeviceSessionTestUtil {
  constructor(
    private readonly app: NestExpressApplication,
    private readonly dataSource: DataSource
  ) {}

  getSessionsForUser() {
    return request(this.app.getHttpServer()).get('/security/devices');
  }

  getAllSessions() {
    return this.dataSource.query(`
      SELECT *
      FROM "device_session"
    `);
  }

  getDeviceSessionsByRefreshToken(refreshToken: string) {
    return request(this.app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', `refreshToken=${refreshToken}`);
  }

  deleteUserSessionsExpectCurrent(refreshToken: string) {
    return request(this.app.getHttpServer())
      .delete('/security/devices')
      .set('Cookie', `refreshToken=${refreshToken}`);
  }

  deleteSessionByDeviceId(args: { deviceId: string; refreshToken: string }) {
    return request(this.app.getHttpServer())
      .delete(`/security/devices/${args.deviceId}`)
      .set('Cookie', `refreshToken=${args.refreshToken}`);
  }
}
