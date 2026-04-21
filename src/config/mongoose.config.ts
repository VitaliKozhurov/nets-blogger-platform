import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables, EnvVariablesType } from '../core/types/env.interface';

export const getMongooseConfig = (configService: ConfigService): MongooseModuleFactoryOptions => {
  return {
    uri: configService.getOrThrow<EnvVariablesType['MONGO_DB_URL']>(EnvVariables.MONGO_DB_URL),
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
