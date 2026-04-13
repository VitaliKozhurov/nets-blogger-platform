import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './api/blogs.controller';
import { CommentsController } from './api/comments.controller';
import { PostsController } from './api/posts.controller';
import { BlogsFactory } from './application/factories/blogs.factory';
import { PostsFactory } from './application/factories/posts.factory';
import { PostsService } from './application/posts.service';
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

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
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
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    CommentsQueryRepository,
    LikesRepository,
    BlogsFactory,
    PostsFactory,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
