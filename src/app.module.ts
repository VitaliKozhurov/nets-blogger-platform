import { configModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestsModule } from './modules/tests/tests.module';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseConfig } from './config/mongoose.config';
import { DomainHttpExceptionsFilter, GlobalHttpExceptionsFilter } from './core/exceptions';
import { CryptoModule } from './modules/crypto/crypto.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    configModule,
    CoreModule,
    MongooseModule.forRootAsync({
      useFactory: getMongooseConfig,
      inject: [ConfigService],
    }),
    UsersAccountModule,
    BloggersPlatformModule,
    CryptoModule,
    NotificationsModule,
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
