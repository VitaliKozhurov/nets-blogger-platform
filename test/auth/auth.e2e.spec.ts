import { JwtService } from '@nestjs/jwt';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { AppThrottleGuard } from 'src/core/guards';
import { EmailService } from 'src/modules/notifications/email.service';
import { RefreshTokenPayload } from 'src/modules/users-account/auth/guards/bearer-auth';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/users-account/constants/injection-tokens';
import { DataSource } from 'typeorm';
import { DeviceSessionTestUtil } from '../device-session/device-session.test-util';
import { UsersTestUtil } from '../users/users.test-util';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { AuthTestUtil } from './auth.test-util';
import { MockEmailService } from './mock-email.service';

describe('E2E Controller  /sa/users', () => {
  let app: NestExpressApplication;
  let authTestUtils: AuthTestUtil;
  let usersTestUtil: UsersTestUtil;
  let deviceSessionTestUtil: DeviceSessionTestUtil;
  let dataSource: DataSource;
  let emailService: MockEmailService;
  let refreshJwtService: JwtService;

  beforeAll(async () => {
    app = await initTestApp(builder => {
      return builder
        .overrideProvider(EmailService)
        .useClass(MockEmailService)
        .overrideGuard(AppThrottleGuard)
        .useValue({
          canActivate: () => true,
        });
    });

    dataSource = app.get<DataSource>(getDataSourceToken());
    authTestUtils = new AuthTestUtil(app, dataSource);
    usersTestUtil = new UsersTestUtil(app);
    deviceSessionTestUtil = new DeviceSessionTestUtil(app, dataSource);
    emailService = app.get<MockEmailService>(EmailService);
    refreshJwtService = app.get<JwtService>(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/registration', () => {
    it('should return 400 status code without basic auth headers', async () => {
      const errorResponse = await authTestUtils
        .registerUser({ login: '', password: '', email: '' })
        .expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(3);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('login');
      expect(fieldNames).toContain('password');
      expect(fieldNames).toContain('email');
    });

    it('should return 400 status code if user with login or email already exists', async () => {
      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);

      const errorResponse = await authTestUtils.registerUser().expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(2);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('login');
      expect(fieldNames).toContain('email');
    });

    it('should return 204 status code and send email for confirmation', async () => {
      const newUserLogin = 'superUser';

      await authTestUtils.registerUser({ login: newUserLogin }).expect(204);

      const isConfirmedStatus = await authTestUtils.getUserConfirmedStatus(newUserLogin);

      expect(isConfirmedStatus.isConfirmed).toBe(false);
    });
  });

  describe('POST /auth/registration-confirmation', () => {
    it('should return 400 status code if send empty confirmation code', async () => {
      const errorResponse = await authTestUtils.confirmationUser('').expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('code');
    });

    it('should return 400 status code if send incorrect confirmation code', async () => {
      const fakeConfirmationCode = randomUUID();
      const errorResponse = await authTestUtils.confirmationUser(fakeConfirmationCode).expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('code');
    });

    it('should return 400 status code if confirmation code is expired', async () => {
      const newUserLogin = 'superUser';

      await authTestUtils.registerUser({ login: newUserLogin }).expect(204);

      const confirmationCode = emailService.userConfirmationCode;

      await authTestUtils.makeConfirmationCodeExpired(newUserLogin);

      const errorResponse = await authTestUtils.confirmationUser(confirmationCode).expect(400);

      const extensions = errorResponse.body.extensions;

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('code');
    });

    it('should return 204 status code if send correct confirmation code', async () => {
      const newUserLogin = 'superUser';

      await authTestUtils.registerUser({ login: newUserLogin }).expect(204);

      const confirmationCode = emailService.userConfirmationCode;

      expect(confirmationCode).toBeDefined();

      await authTestUtils.confirmationUser(confirmationCode).expect(204);

      const isConfirmedStatus = await authTestUtils.getUserConfirmedStatus(newUserLogin);

      expect(isConfirmedStatus.isConfirmed).toBe(true);
    });
  });

  describe('POST /auth/registration-email-resending', () => {
    it('should return 400 status code if send incorrect email (validation error)', async () => {
      const errorResponse = await authTestUtils.registrationEmailResending('badEmail').expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('email');
    });

    it('should return 400 status code if send incorrect email (not exists)', async () => {
      const errorResponse = await authTestUtils
        .registrationEmailResending('notExists@mail.com')
        .expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('email');
    });

    it('should return 400 status code if user is confirmed', async () => {
      await authTestUtils.registerUser().expect(204);

      await authTestUtils.confirmationUser(emailService.userConfirmationCode).expect(204);

      const errorResponse = await authTestUtils
        .registrationEmailResending(emailService.userEmail)
        .expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('email');
    });

    it('should return 204 status code and send confirmation code to user email', async () => {
      const sendRegistrationConfirmationCode = jest.spyOn(
        emailService,
        'sendRegistrationConfirmationCode'
      );

      await authTestUtils.registerUser().expect(204);

      await authTestUtils.registrationEmailResending(emailService.userEmail).expect(204);

      expect(sendRegistrationConfirmationCode).toHaveBeenCalled();
      expect(sendRegistrationConfirmationCode).toHaveBeenCalledTimes(2);
    });
  });

  describe('POST /auth/login', () => {
    it('should return 400 status code if send incorrect values (validation error)', async () => {
      const errorResponse = await authTestUtils.login('', '').expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(2);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('loginOrEmail');
      expect(fieldNames).toContain('password');
    });

    it('should return 401 status code if send incorrect values (not existing)', async () => {
      await authTestUtils.login('fakeLogin', 'fakePassword').expect(401);
    });

    it('should return 200 status code with auth tokens', async () => {
      await authTestUtils.registerUser().expect(204);

      const response = await authTestUtils.loginByUserLogin().expect(200);
      const accessToken = response.body.accessToken;
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should create device session', async () => {
      await authTestUtils.registerUser().expect(204);

      const response = await authTestUtils.loginByUserLogin().expect(200);
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

      const deviceSessions = await deviceSessionTestUtil
        .getDeviceSessionsByRefreshToken(refreshToken)
        .expect(200);

      expect(deviceSessions.body.length).toBe(1);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 401 status code if send data without refresh token', async () => {
      await authTestUtils.logout().expect(401);
    });

    it('should return 204 status code and remove user session', async () => {
      await authTestUtils.registerUser().expect(204);

      const response = await authTestUtils.loginByUserLogin().expect(200);
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

      const prevDeviceSessions = await deviceSessionTestUtil.getAllSessions();

      expect(prevDeviceSessions.length).toBe(1);

      await authTestUtils.logout().set('Cookie', `refreshToken=${refreshToken}`).expect(204);

      const currentDeviceSessions = await deviceSessionTestUtil.getAllSessions();

      expect(currentDeviceSessions.length).toBe(0);
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should return 401 status code if send data with incorrect refresh token', async () => {
      await authTestUtils.refreshToken('').expect(401);
    });

    it('should return 401 status code with incorrect refresh token (user not exist)', async () => {
      const refreshToken = await refreshJwtService.signAsync({
        userId: randomUUID(),
        deviceId: randomUUID(),
        login: 'fakeLogin',
      });

      await authTestUtils.refreshToken(refreshToken).expect(401);
    });

    it('should return 401 status code with incorrect refresh token (expired)', async () => {
      await authTestUtils.registerUser().expect(204);

      const response = await authTestUtils.loginByUserLogin().expect(200);
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

      const tokenPayload = (await refreshJwtService.verifyAsync(
        refreshToken
      )) as RefreshTokenPayload;

      const expiredRefreshToken = await refreshJwtService.signAsync(
        {
          userId: tokenPayload.userId,
          deviceId: tokenPayload.deviceId,
          login: tokenPayload.login,
        },
        {
          expiresIn: '-1s',
        }
      );

      await authTestUtils.refreshToken(expiredRefreshToken).expect(401);
    });

    it('should return 200 status code with new pairs auth tokens', async () => {
      await authTestUtils.registerUser().expect(204);

      const response = await authTestUtils.loginByUserLogin().expect(200);
      const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];

      const responseWithNewTokens = await authTestUtils.refreshToken(refreshToken).expect(200);

      const newAccessToken = responseWithNewTokens.body.accessToken;
      const newRefreshToken = responseWithNewTokens.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      expect(newAccessToken).toBeDefined();
      expect(newRefreshToken).toBeDefined();
    });
  });
});
