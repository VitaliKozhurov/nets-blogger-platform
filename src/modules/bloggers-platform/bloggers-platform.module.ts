import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './application/blogs.service';
import { BlogsController } from './controllers/blogs.controller';
import { Blog, BlogSchema } from './domain/blogs/blog.schema';
import { Like, LikeSchema } from './domain/likes/like.schema';
import { Post, PostSchema } from './domain/posts/post.schema';
import { BlogsQueryRepository } from './repository/blogs/blogs-query.repository';
import { BlogsRepository } from './repository/blogs/blogs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsRepository, BlogsQueryRepository, BlogsService],
})
export class BloggersPlatformModule {}
