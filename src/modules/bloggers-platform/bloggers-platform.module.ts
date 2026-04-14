import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './api/blogs.controller';
import { CommentsController } from './api/comments.controller';
import { PostsController } from './api/posts.controller';
import { BlogsFactory } from './application/factories/blogs.factory';
import { PostsFactory } from './application/factories/posts.factory';
import { CreateBlogUseCase } from './application/use-cases/blogs/create-blog.usecase';
import { DeleteBlogUseCase } from './application/use-cases/blogs/delete-blog.usecase.dto';
import { UpdateBlogUseCase } from './application/use-cases/blogs/update-blog.usecase';
import { CreatePostUseCase } from './application/use-cases/posts/create-post.usecase';
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
import { UpdatePostUseCase } from './application/use-cases/posts/update-post.usecase';
import { DeletePostCommand } from './application/use-cases/posts/delete-post.usecase';
import { CommentsRepository } from './repository/comments/comments.repository';
import { DeleteCommentUseCase } from './application/use-cases/comments/delete-comment.usecase';
import { UpdateCommentContentUseCase } from './application/use-cases/comments/update-comment-content.usecase';
import { LikesFactory } from './application/factories/likes.factory';
import { CommentsFactory } from './application/factories/comments.factory';
import { CreateCommentUseCase } from './application/use-cases/comments/create-comment.usecase';
import { UpdatePostLikeStatusUseCase } from './application/use-cases/posts/update-post-like-status.usecase';

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
