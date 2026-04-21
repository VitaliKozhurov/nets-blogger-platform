import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupAppConfig } from './config/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupAppConfig(app);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  const port = coreConfig.port;

  await app.listen(port);
}

bootstrap();
