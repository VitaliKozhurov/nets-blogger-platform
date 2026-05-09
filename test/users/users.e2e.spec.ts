import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { IPaginationResponseDto } from 'src/core/dto/contracts/pagination-response.dto';
import { DomainExceptionCode } from 'src/core/exceptions';
import { IUserResponseDto } from 'src/modules/users-account/users/api/dto';
import { DataSource } from 'typeorm';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { UsersTestUtil } from './users.test-util';

type GetUsersResponse = IPaginationResponseDto<IUserResponseDto[]>;

describe('E2E Controller  /sa/users', () => {
  let app: NestExpressApplication;
  let usersTestUtils: UsersTestUtil;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await initTestApp();
    usersTestUtils = new UsersTestUtil(app);
    dataSource = app.get<DataSource>(getDataSourceToken());
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /sa/users', () => {
    it('should return 401 status code without basic auth headers', async () => {
      return usersTestUtils.getUsers().expect(401);
    });

    it('should return 200 status code with basic auth headers', () => {
      return usersTestUtils.getUsers().set('Authorization', VALID_BASIC_HEADER).expect(200);
    });

    it('should return 200 status code with empty array', async () => {
      const response = await usersTestUtils
        .getUsers()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      const body: GetUsersResponse = response.body;

      expect(body.items.length).toBe(0);
      expect(body.totalCount).toBe(0);
      expect(body.pagesCount).toBe(0);
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(10);
    });

    it('should return 200 status code with created user', async () => {
      const { body: createdUser } = await usersTestUtils
        .createUser()
        .set('Authorization', VALID_BASIC_HEADER);

      const response = await usersTestUtils
        .getUsers()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      const body: GetUsersResponse = response.body;

      expect(body.items.length).toBe(1);
      expect(body.totalCount).toBe(1);
      expect(body.items).toContainEqual(createdUser);
    });
  });

  describe('POST /sa/users', () => {
    it('should return 401 status code without basic auth headers', async () => {
      return usersTestUtils.createUser().expect(401);
    });

    it('should return 201 status code with basic auth headers', () => {
      return usersTestUtils.createUser().set('Authorization', VALID_BASIC_HEADER).expect(201);
    });

    it('should return 400 status code if body has invalid values', async () => {
      const errorResponse = await usersTestUtils
        .createUser({ login: '', password: '', email: '' })
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(3);

      const fieldNames = extensions.map(ext => ext.field);

      expect(fieldNames).toContain('login');
      expect(fieldNames).toContain('password');
      expect(fieldNames).toContain('email');
    });

    it('should return 400 status code if try create user with the same credentials', async () => {
      await usersTestUtils.createUser().set('Authorization', VALID_BASIC_HEADER).expect(201);

      const errorResponse = await usersTestUtils
        .createUser()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);
      expect(extensions[0].field).toBe('email');
    });
  });

  describe('DELETE /sa/users/:userId', () => {
    it('should return 401 status code without basic auth headers', async () => {
      return usersTestUtils.deleteUser('randomId').expect(401);
    });

    it('should return 400 status code if send incorrect user id', async () => {
      const errorResponse = await usersTestUtils
        .deleteUser('fakeId')
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(400);

      const extensions = errorResponse.body.extensions;

      expect(extensions.length).toBe(1);
      expect(extensions[0].field).toBe('uri param');
    });

    it('should return 404 status code if user not found', async () => {
      const notExistingUserId = randomUUID();

      const errorResponse = await usersTestUtils
        .deleteUser(notExistingUserId)
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(404);

      const code = errorResponse.body.code;

      console.log(errorResponse.body);

      expect(code).toBe(DomainExceptionCode.NOT_FOUND_ERROR);
    });

    it('should return 201 status code with basic auth headers', async () => {
      const createdUser = await usersTestUtils
        .createUser()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(201);

      const responseBeforeDeleting = await usersTestUtils
        .getUsers()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      expect(responseBeforeDeleting.body.items.length).toBe(1);

      const userId = createdUser.body.id;

      await usersTestUtils.deleteUser(userId).set('Authorization', VALID_BASIC_HEADER).expect(204);

      const responseAfterDeleting = await usersTestUtils
        .getUsers()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      expect(responseAfterDeleting.body.items.length).toBe(0);
    });
  });
});
