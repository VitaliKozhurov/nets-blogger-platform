import { setupSwaggerConfig } from './swagger.config';
import { setupPipesConfig } from './pipes.config';
import { INestApplication } from '@nestjs/common';

export const setupAppConfig = (app: INestApplication) => {
  setupPipesConfig(app);
  setupSwaggerConfig(app);
};
