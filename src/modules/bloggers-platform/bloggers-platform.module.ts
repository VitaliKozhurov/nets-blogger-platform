import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs/blog.schema';
import { BlogsController } from './controllers/blogs.controller';
import { BlogsRepository } from './repository/blogs/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs/blogs-query.repository';
import { BlogsService } from './application/blogs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  controllers: [BlogsController],
  providers: [BlogsRepository, BlogsQueryRepository, BlogsService],
})
export class BloggersPlatformModule {}
