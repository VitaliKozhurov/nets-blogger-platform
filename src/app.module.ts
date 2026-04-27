import { appConfigModule } from './config/app-config-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionsFilter, GlobalHttpExceptionsFilter } from './core/exceptions';
import { CryptoModule } from './modules/crypto/crypto.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CoreModule } from './core/core.module';
import { TestsModule } from './modules/tests/tests.module';
import { DataBaseModule } from './modules/database/database.module';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const shouldImportTestsModule = nodeEnv !== 'production';

@Module({
  imports: [
    appConfigModule,
    CoreModule,
    DataBaseModule,
    UsersAccountModule,
    BloggersPlatformModule,
    CryptoModule,
    NotificationsModule,
    ...(shouldImportTestsModule ? [TestsModule] : []),
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
