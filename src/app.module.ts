import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestsModule } from './modules/tests/tests.module';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseConfig } from './config/mongoose.config';
import { DomainHttpExceptionsFilter, GlobalHttpExceptionsFilter } from './core/exceptions';
import { CryptoModule } from './modules/crypto/crypto.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
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
