import { setupSwaggerConfig } from './swagger.config';
import { setupPipesConfig } from './pipes.config';
import { NestExpressApplication } from '@nestjs/platform-express';

export const setupAppConfig = (app: NestExpressApplication) => {
  app.set('trust proxy', 'loopback');

  setupPipesConfig(app);
  setupSwaggerConfig(app);
};
