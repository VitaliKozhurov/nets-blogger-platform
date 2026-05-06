import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupAppConfig } from 'src/config/app.config';
import { DataSource } from 'typeorm';
import { clearDatabase } from '../utils/db-tests.utils';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { getDataSourceToken } from '@nestjs/typeorm';
import { IUserResponseDto } from 'src/modules/users-account/users/api/dto';
import { IPaginationResponseDto } from 'src/core/dto/contracts/pagination-response.dto';

type GetUsersResponse = IPaginationResponseDto<IUserResponseDto[]>;

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const testingModuleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    const moduleFixture: TestingModule = await testingModuleBuilder.compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    setupAppConfig(app);

    await app.init();
    dataSource = app.get<DataSource>(getDataSourceToken());

    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    await app.close();
  });

  describe('/sa/users (GET)', () => {
    it('should return 401 status code without basic auth headers', () => {
      return request(app.getHttpServer()).get('/sa/users').expect(401);
    });

    it('should return 200 status code with basic auth headers', () => {
      return request(app.getHttpServer())
        .get('/sa/users')
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);
    });

    it('should return 200 status code with empty array', async () => {
      const response = await request(app.getHttpServer())
        .get('/sa/users')
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      const body: GetUsersResponse = response.body;

      expect(body.items.length).toBe(0);
      expect(body.totalCount).toBe(0);
      expect(body.pagesCount).toBe(0);
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(10);
    });
  });
});
