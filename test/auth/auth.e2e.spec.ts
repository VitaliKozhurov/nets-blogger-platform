import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { AppThrottleGuard } from 'src/core/guards';
import { EmailService } from 'src/modules/notifications/email.service';
import { DataSource } from 'typeorm';
import { UsersTestUtil } from '../users/users.test-util';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { AuthTestUtil } from './auth.test-util';

class MockEmailService {
  public userConfirmationCode: string = '';
  public userEmail: string = '';

  sendRegistrationConfirmationCode(dto: { email: string; confirmationCode: string }) {
    this.userConfirmationCode = dto.confirmationCode;
    this.userEmail = dto.email;
    console.log(`Send registration data: ${JSON.stringify(dto)}`);
  }

  sendPasswordRecoveryCode(dto: { email: string; recoveryCode: string }) {
    console.log(`Send recovery data: ${JSON.stringify(dto)}`);
  }
}

describe('E2E Controller  /sa/users', () => {
  let app: NestExpressApplication;
  let authTestUtils: AuthTestUtil;
  let usersTestUtil: UsersTestUtil;
  let dataSource: DataSource;
  let emailService: MockEmailService;

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
    emailService = app.get<MockEmailService>(EmailService);
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
});
