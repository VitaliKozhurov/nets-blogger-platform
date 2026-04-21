import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
  BlogsController,
  BlogsFactory,
  BlogsQueryRepository,
  BlogsRepository,
  CreateBlogUseCase,
  DeleteBlogUseCase,
  UpdateBlogUseCase,
} from './blogs';
import {
  Comment,
  CommentSchema,
  CommentsController,
  CommentsFactory,
  CommentsQueryRepository,
  CommentsRepository,
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentContentUseCase,
  UpdateCommentLikeStatusUseCase,
} from './comments';
import { Like, LikeSchema, LikesFactory, LikesRepository } from './likes';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  Post,
  PostSchema,
  PostsController,
  PostsFactory,
  PostsQueryRepository,
  PostsRepository,
  UpdatePostLikeStatusUseCase,
  UpdatePostUseCase,
} from './posts';
import { UsersAccountModule } from '../users-account/users-account.module';
import { JwtModule } from '@nestjs/jwt';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  UpdateCommentContentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  UpdatePostLikeStatusUseCase,
  UpdateCommentLikeStatusUseCase,
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
