import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupAppConfig } from './config/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupAppConfig(app);

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
