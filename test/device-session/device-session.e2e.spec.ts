import { NestExpressApplication } from '@nestjs/platform-express';
import { DeviceSessionTestUtil } from './device-session.test-util';
import { initTestApp } from '../utils/init-test-app';
import { AppThrottleGuard } from 'src/core/guards';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AuthTestUtil } from '../auth/auth.test-util';
import { UsersTestUtil } from '../users/users.test-util';
import { clearDatabase } from '../utils/db-tests.utils';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/users-account/constants/injection-tokens';

describe('E2E Controller /security/devices', () => {
  let app: NestExpressApplication;
  let authTestUtils: AuthTestUtil;
  let usersTestUtil: UsersTestUtil;
  let deviceSessionTestUtil: DeviceSessionTestUtil;
  let dataSource: DataSource;
  let refreshJwtService: JwtService;

  beforeAll(async () => {
    app = await initTestApp(builder => {
      return builder.overrideGuard(AppThrottleGuard).useValue({
        canActivate: () => true,
      });
    });

    dataSource = app.get<DataSource>(getDataSourceToken());
    authTestUtils = new AuthTestUtil(app, dataSource);
    usersTestUtil = new UsersTestUtil(app);
    deviceSessionTestUtil = new DeviceSessionTestUtil(app, dataSource);
    refreshJwtService = app.get<JwtService>(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /security/devices', () => {
    it('should return 401 status code if request without bearer token', async () => {
      await deviceSessionTestUtil.getSessionsForUser().expect(401);
    });

    it('should return 200 status code and empty array of sessions if send incorrect refresh token', async () => {
      const fakeRefreshToken = await refreshJwtService.signAsync({
        userId: randomUUID(),
        deviceId: randomUUID(),
        login: 'fakeLogin',
      });

      const response = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(fakeRefreshToken)
        .expect(200);

      expect(response.body.length).toBe(0);
    });

    it('should return 200 status code with user sessions', async () => {
      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const { headers } = await authTestUtils.loginByUserLogin();

      const refreshToken = headers['set-cookie'][0].split(';')[0].split('=')[1];

      const response = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshToken)
        .expect(200);

      expect(response.body.length).toBe(1);
    });
  });

  describe('DELETE /security/devices', () => {
    it('should return 401 status code if request without bearer token', async () => {
      await deviceSessionTestUtil.deleteUserSessionsExpectCurrent('').expect(401);
    });

    it('should return 204 status code and should stay current session', async () => {
      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);

      const responseFirstSession = await authTestUtils.loginByUserLogin();

      await authTestUtils.loginByUserLogin();

      const refreshTokenFirstSession = responseFirstSession.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      const responseBeforeDeleting = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshTokenFirstSession)
        .expect(200);

      expect(responseBeforeDeleting.body.length).toBe(2);

      await deviceSessionTestUtil.deleteUserSessionsExpectCurrent(refreshTokenFirstSession);

      const responseAfterDeleting = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshTokenFirstSession)
        .expect(200);

      expect(responseAfterDeleting.body.length).toBe(1);
    });
  });

  describe('DELETE /security/devices/:deviceId', () => {
    it('should return 401 status code if request with incorrect bearer token', async () => {
      const fakeDeviceId = randomUUID();

      await deviceSessionTestUtil
        .deleteSessionByDeviceId({
          refreshToken: 'fakeRefresh',
          deviceId: fakeDeviceId,
        })
        .expect(401);
    });

    it('should return 404 status code if request with incorrect deviceId', async () => {
      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const response = await authTestUtils.loginByUserLogin();
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
      const fakeDeviceId = randomUUID();

      await deviceSessionTestUtil
        .deleteSessionByDeviceId({ refreshToken, deviceId: fakeDeviceId })
        .expect(404);
    });

    it('should return 403 status code if try remove other user session', async () => {
      const firstUser = {
        login: 'login1',
        password: 'password1',
        email: 'example1@gmail.com',
      };

      const secondUser = {
        login: 'login2',
        password: 'password2',
        email: 'example2@gmail.com',
      };

      await usersTestUtil.createUser(firstUser).set('Authorization', VALID_BASIC_HEADER);
      await usersTestUtil.createUser(secondUser).set('Authorization', VALID_BASIC_HEADER);

      const responseFirstUser = await authTestUtils.login(firstUser.login, firstUser.password);
      const responseSecondUser = await authTestUtils.login(secondUser.login, secondUser.password);

      const refreshTokenFirstUser = responseFirstUser.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];
      const refreshSecondFirstUser = responseSecondUser.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      const devicesSecondUser = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshSecondFirstUser)
        .expect(200);

      const otherUserDeviceId = devicesSecondUser.body[0].deviceId;

      await deviceSessionTestUtil
        .deleteSessionByDeviceId({
          refreshToken: refreshTokenFirstUser,
          deviceId: otherUserDeviceId,
        })
        .expect(403);
    });

    it('should return 204 status code and remove device session', async () => {
      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);

      const response = await authTestUtils.loginByUserLogin();
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

      const responseBeforeDeleting = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshToken)
        .expect(200);

      expect(responseBeforeDeleting.body.length).toBe(1);

      const deviceId = responseBeforeDeleting.body[0].deviceId;

      await deviceSessionTestUtil.deleteSessionByDeviceId({ refreshToken, deviceId }).expect(204);

      const responseAfterDeleting = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshToken)
        .expect(200);

      expect(responseAfterDeleting.body.length).toBe(0);
    });
  });
});
