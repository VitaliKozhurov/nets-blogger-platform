import { Logger } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoreConfig } from 'src/core/core.config';

export const getDatabaseProviders = () => [
  TypeOrmModule.forRootAsync({
    useFactory: async (configService: CoreConfig): Promise<TypeOrmModuleOptions> => {
      return {
        type: 'postgres',
        host: 'localhost',
        port: configService.postgresPort,
        username: configService.postgresUser,
        password: configService.postgresPassword,
        database: configService.postgresDB,
        autoLoadEntities: false,
        synchronize: false,
      };
    },
    inject: [CoreConfig],
  }),
  MongooseModule.forRootAsync({
    useFactory: async (configService: CoreConfig): Promise<MongooseModuleFactoryOptions> => {
      return {
        uri: configService.mongoURI,
        retryAttempts: 5,
        retryDelay: 3000,
        onConnectionCreate: connection => {
          connection.on('connected', () => {
            Logger.log('✅ Mongo database connected successfully!', 'Mongo DB');
          });

          connection.on('error', error => {
            Logger.error(`❌ Mongo database connection error: ${error.message}`, error.stack, 'DB');
          });

          connection.on('disconnected', () => {
            Logger.warn('⚠️ Mongo database disconnected', 'Mongo DB');
          });
        },
      };
    },
    inject: [CoreConfig],
  }),
];
