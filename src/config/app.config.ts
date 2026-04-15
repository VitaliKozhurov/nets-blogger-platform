import { setupSwaggerConfig } from './swagger.config';
import { setupPipesConfig } from './pipes.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

export const setupAppConfig = (app: NestExpressApplication) => {
  app.set('trust proxy', 'loopback');
  app.use(cookieParser());
  setupPipesConfig(app);
  setupSwaggerConfig(app);
};
