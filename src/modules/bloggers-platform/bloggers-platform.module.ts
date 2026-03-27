import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './application/blogs.service';
import { PostsService } from './application/posts.service';
import { BlogsController } from './controllers/blogs.controller';
import { CommentsController } from './controllers/comments.controller';
import { PostsController } from './controllers/posts.controller';
import { Blog, BlogSchema } from './domain/blogs/blog.schema';
import { CommentSchema } from './domain/comments/comment.schema';
import { Like, LikeSchema } from './domain/likes/like.schema';
import { Post, PostSchema } from './domain/posts/post.schema';
import { BlogsExternalRepository } from './repository/blogs/blogs-external.repository';
import { BlogsQueryRepository } from './repository/blogs/blogs-query.repository';
import { BlogsRepository } from './repository/blogs/blogs.repository';
import { CommentsExternalRepository } from './repository/comments/comments-external.repository';
import { CommentsQueryRepository } from './repository/comments/comments-query.repository';
import { LikesExternalRepository } from './repository/likes/likes-external.repository';
import { LikesRepository } from './repository/likes/likes.repository';
import { PostsExternalRepository } from './repository/posts/posts-external.repository';
import { PostsQueryRepository } from './repository/posts/posts-query.repository';
import { PostsRepository } from './repository/posts/posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    CommentsQueryRepository,
    LikesRepository,
  ],
  exports: [
    BlogsExternalRepository,
    PostsExternalRepository,
    CommentsExternalRepository,
    LikesExternalRepository,
  ],
})
export class BloggersPlatformModule {}
