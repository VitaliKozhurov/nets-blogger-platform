import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { setupAppConfig } from '../../src/config/app.config';
import { clearDatabase } from './db-tests.utils';

export const initTestApp = async (customBuilderSetup?: (builder: TestingModuleBuilder) => void) => {
  const testingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  customBuilderSetup?.(testingModuleBuilder);

  const moduleFixture: TestingModule = await testingModuleBuilder.compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();

  setupAppConfig(app);

  await app.init();

  const dataSource = app.get<DataSource>(getDataSourceToken());

  await clearDatabase(dataSource);

  return app;
};
