import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersAccountModule } from '../users-account/users-account.module';
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
  SuperAdminBlogsController,
  UpdateBlogUseCase,
} from './blogs';
import {
  CommentsController,
  CommentsFactory,
  CommentsQueryRepository,
  CommentsRepository,
  CreateCommentUseCase,
  DeleteCommentUseCase,
  GetCommentByIdHandler,
  UpdateCommentContentUseCase,
  UpdateCommentLikeStatusUseCase,
} from './comments';
import { LikesFactory, LikesRepository } from './likes';
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
import {
  CreateCommentByPostUseCase,
  GetPostCommentsHandler,
  GetPostsByIdHandler,
  GetPostsHandler,
} from './posts/application';

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
  CreateCommentByPostUseCase,
];

const queryHandlers = [
  GetBlogsHandler,
  GetBlogByIdHandler,
  GetPostsByBlogIdHandler,
  GetPostsHandler,
  GetPostsByIdHandler,
  GetCommentByIdHandler,
  GetPostCommentsHandler,
];

@Module({
  imports: [JwtModule, UsersAccountModule],
  controllers: [SuperAdminBlogsController, BlogsController, PostsController, CommentsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    BlogsFactory,
    BlogsRepository,
    BlogsQueryRepository,
    PostsFactory,
    PostsRepository,
    PostsQueryRepository,
    CommentsFactory,
    CommentsRepository,
    CommentsQueryRepository,
    LikesFactory,
    LikesRepository,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
