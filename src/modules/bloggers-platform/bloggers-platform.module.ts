import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './application/blogs.service';
import { PostsService } from './application/posts.service';
import { BlogsController } from './api/blogs.controller';
import { CommentsController } from './api/comments.controller';
import { PostsController } from './api/posts.controller';
import { Blog, BlogSchema } from './domain/blogs/blog.schema';
import { Comment, CommentSchema } from './domain/comments/comment.schema';
import { Like, LikeSchema } from './domain/likes/like.schema';
import { Post, PostSchema } from './domain/posts/post.schema';
import { BlogsQueryRepository } from './repository/blogs/blogs-query.repository';
import { BlogsRepository } from './repository/blogs/blogs.repository';
import { CommentsQueryRepository } from './repository/comments/comments-query.repository';
import { LikesRepository } from './repository/likes/likes.repository';
import { PostsQueryRepository } from './repository/posts/posts-query.repository';
import { PostsRepository } from './repository/posts/posts.repository';
import { BlogsFactory } from './application/factories/blogs.factory';
import { CreateBlogUseCase } from './application/use-cases/blogs/create-blog.usecase';
import { UpdateBlogUseCase } from './application/use-cases/blogs/update-blog.usecase';
import { DeleteBlogUseCase } from './application/use-cases/blogs/delete-blog.usecase.dto';

const commandHandlers = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    ...commandHandlers,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    CommentsQueryRepository,
    LikesRepository,
    BlogsFactory,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
