import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogsController,
  BlogsFactory,
  BlogsQueryRepository,
  BlogsRepository,
  CreateBlogUseCase,
  DeleteBlogUseCase,
  GetBlogByIdHandler,
  GetBlogsHandler,
  GetPostsByBlogIdHandler,
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
  PostsController,
  PostsFactory,
  PostsQueryRepository,
  PostsRepository,
  UpdatePostLikeStatusUseCase,
  UpdatePostUseCase,
} from './posts';
import { UsersAccountModule } from '../users-account/users-account.module';
import { JwtModule } from '@nestjs/jwt';
import { GetPostsByIdHandler, GetPostsHandler } from './posts/application';

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

const queryHandlers = [
  GetBlogsHandler,
  GetBlogByIdHandler,
  GetPostsByBlogIdHandler,
  GetPostsHandler,
  GetPostsByIdHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    JwtModule,
    UsersAccountModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
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
