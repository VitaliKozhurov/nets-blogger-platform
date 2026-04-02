import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupAppConfig(app);

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
