import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { TestsModule } from './modules/tests/tests.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [UsersAccountModule, TestsModule, BloggersPlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
