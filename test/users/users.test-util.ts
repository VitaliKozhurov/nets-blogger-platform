import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';

type CreateUser = {
  login: string;
  password: string;
  email: string;
};

export class UsersTestUtil {
  constructor(private readonly app: NestExpressApplication) {}

  createUser(userDto: Partial<CreateUser> = {}) {
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

  getUsers() {
    return request(this.app.getHttpServer()).get('/sa/users');
  }
}
