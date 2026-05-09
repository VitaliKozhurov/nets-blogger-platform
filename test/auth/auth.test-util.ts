import { NestExpressApplication } from '@nestjs/platform-express';
import { IRegistrationDto } from 'src/modules/users-account/auth/application/dto';
import request from 'supertest';
import { DataSource } from 'typeorm';

export class AuthTestUtil {
  constructor(
    private readonly app: NestExpressApplication,
    private readonly dataSource: DataSource
  ) {}

  registerUser(registerDto: Partial<IRegistrationDto> = {}) {
    return request(this.app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'login',
        password: 'password',
        email: 'example@gmail.com',
        ...registerDto,
      });
  }

  confirmationUser(code: string) {
    return request(this.app.getHttpServer()).post('/auth/registration-confirmation').send({
      code,
    });
  }

  registrationEmailResending(email?: string) {
    return request(this.app.getHttpServer())
      .post('/auth/registration-email-resending')
      .send({
        email: email || 'example@gmail.com',
      });
  }

  loginByUserLogin() {
    return request(this.app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: 'login',
      password: 'password',
    });
  }
  loginByUserEmail() {
    return request(this.app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: 'example@gmail.com',
      password: 'password',
    });
  }

  async makeConfirmationCodeExpired(login: string): Promise<{ code: string }> {
    const [confirmation] = await this.dataSource.query(
      `
      UPDATE user_confirmations uc
      SET "expirationDate" = NOW() - INTERVAL '1 hour'
      FROM users u
      WHERE uc."userId" = u.id
        AND u.login = $1
      RETURNING uc.code
    `,
      [login]
    );

    return confirmation;
  }

  async getUserConfirmedStatus(login: string) {
    const [confirmation] = await this.dataSource.query(
      `
      SELECT uc."isConfirmed"
      FROM users u
      JOIN user_confirmations uc ON uc."userId" = u.id
      WHERE u.login = $1
    `,
      [login]
    );

    return confirmation;
  }
}
