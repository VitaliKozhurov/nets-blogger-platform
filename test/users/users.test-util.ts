import { NestExpressApplication } from '@nestjs/platform-express';
import request, { Test } from 'supertest';
import { ICreateUserByAdminDto } from '../../src/modules/users-account/users/application/dto';

export class UsersTestUtil {
  constructor(private readonly app: NestExpressApplication) {}

  createUser(userDto: Partial<ICreateUserByAdminDto> = {}) {
    return request(this.app.getHttpServer())
      .post('/sa/users')
      .send({
        login: 'login',
        password: 'password',
        email: 'example@gmail.com',
        ...userDto,
      });
  }

  deleteUser(userId: string) {
    return request(this.app.getHttpServer()).delete(`/sa/users/${userId}`);
  }

  getUsers(): Test {
    return request(this.app.getHttpServer()).get('/sa/users');
  }
}
