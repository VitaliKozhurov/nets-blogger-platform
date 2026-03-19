import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { AppConfigService } from './config.types';

export const getMongooseConfig = (
  configService: AppConfigService
): MongooseModuleFactoryOptions => {
  return {
    uri: configService.getOrThrow('MONGO_DB_URL'),
  };
};
