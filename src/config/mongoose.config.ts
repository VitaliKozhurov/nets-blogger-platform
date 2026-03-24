import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { AppConfigService } from './config.types';
import { Logger } from '@nestjs/common';

export const getMongooseConfig = (
  configService: AppConfigService
): MongooseModuleFactoryOptions => {
  return {
    uri: configService.getOrThrow('MONGO_DB_URL'),
    retryAttempts: 5,
    retryDelay: 3000,
    onConnectionCreate: connection => {
      connection.on('connected', () => {
        Logger.log('✅ Database connected successfully!', 'DB');
      });

      connection.on('error', error => {
        Logger.error(`❌ Mongo error: ${error.message}`, error.stack, 'DB');
      });

      connection.on('disconnected', () => {
        Logger.warn('⚠️ Mongo disconnected', 'DB');
      });
    },
  };
};
