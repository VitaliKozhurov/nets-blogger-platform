import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { Logger } from '@nestjs/common';
import { CoreConfig } from 'src/core/core.config';

export const getMongooseConfig = (configService: CoreConfig): MongooseModuleFactoryOptions => {
  return {
    uri: configService.mongoURI,
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
