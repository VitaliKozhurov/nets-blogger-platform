import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { TestsModule } from './modules/tests/tests.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseConfig } from './config/mongoose.config';
import { CryptoModule } from './modules/crypto/crypto.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionsFilter, GlobalHttpExceptionsFilter } from './core/exceptions';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: getMongooseConfig,
      inject: [ConfigService],
    }),
    UsersAccountModule,
    BloggersPlatformModule,
    CryptoModule,
    TestsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
