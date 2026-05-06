import { setupSwaggerConfig } from './swagger.config';
import { setupPipesConfig } from './pipes.config';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

export const setupAppConfig = (app: NestExpressApplication) => {
  app.set('trust proxy', 'loopback');
  app.use(cookieParser());
  setupPipesConfig(app);
  setupSwaggerConfig(app);
};
