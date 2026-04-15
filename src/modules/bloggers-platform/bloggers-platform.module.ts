import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './api/blogs.controller';
import { CommentsController } from './api/comments.controller';
import { PostsController } from './api/posts.controller';
import { BlogsFactory } from './application/factories/blogs.factory';
import { CommentsFactory } from './application/factories/comments.factory';
import { LikesFactory } from './application/factories/likes.factory';
import { PostsFactory } from './application/factories/posts.factory';
import {
  CreateBlogUseCase,
  CreateCommentUseCase,
  CreatePostUseCase,
  DeleteBlogUseCase,
  DeleteCommentUseCase,
  DeletePostCommand,
  UpdateBlogUseCase,
  UpdateCommentContentUseCase,
  UpdatePostLikeStatusUseCase,
  UpdatePostUseCase,
} from './application/use-cases';
import { Blog, BlogSchema } from './domain/blogs/blog.schema';
import { Comment, CommentSchema } from './domain/comments/comment.schema';
import { Like, LikeSchema } from './domain/likes/like.schema';
import { Post, PostSchema } from './domain/posts/post.schema';
import {
  BlogsQueryRepository,
  BlogsRepository,
  CommentsQueryRepository,
  CommentsRepository,
  LikesRepository,
  PostsQueryRepository,
  PostsRepository,
} from './repository';
import { UsersAccountModule } from '../users-account/users-account.module';
import { JwtModule } from '@nestjs/jwt';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostCommand,
  UpdateCommentContentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  UpdatePostLikeStatusUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    JwtModule,
    UsersAccountModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    ...commandHandlers,
    BlogsRepository,
    BlogsQueryRepository,
    CommentsRepository,
    PostsQueryRepository,
    PostsRepository,
    CommentsQueryRepository,
    LikesRepository,
    BlogsFactory,
    PostsFactory,
    CommentsFactory,
    LikesFactory,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
