import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CreateBlogCommand } from '../application/use-cases/blogs/create-blog.usecase';
import { DeleteBlogCommand } from '../application/use-cases/blogs/delete-blog.usecase.dto';
import { UpdateBlogCommand } from '../application/use-cases/blogs/update-blog.usecase';
import { CreateBlogSwagger } from '../decorators/swagger/blogs/create-blog-swagger.decorator';
import { DeleteBlogSwagger } from '../decorators/swagger/blogs/delete-blog-swagger.decorator';
import { GetBlogSwagger } from '../decorators/swagger/blogs/get-blog-swagger.decorator';
import { GetBlogsSwagger } from '../decorators/swagger/blogs/get-blogs-swagger.decorator';
import { UpdateBlogSwagger } from '../decorators/swagger/blogs/update-blog-swagger.dto';
import { BlogsQueryRepository } from '../repository/blogs/blogs-query.repository';
import { BlogsRepository } from '../repository/blogs/blogs.repository';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';
import { CreateBlogRequestDto } from './dto/blogs/create-blog.dto';
import { GetBlogsQueryDto } from './dto/blogs/get-blogs-query.dto';
import { UpdateBlogRequestDto } from './dto/blogs/update-blog.dto';
import { GetPostsQueryDto } from './dto/posts/get-posts-query.dto';
import { GetPostsByBlogIdSwagger } from '../decorators/swagger/blogs/get-posts-by-blog-id-swagger.decorator';
import { CreatePostCommand } from '../application/use-cases/posts/create-post.usecase';
import { CreatePostByBlogIdRequestDto } from './dto/posts/create-post.dto';
import { CreatePostByBlogIdSwagger } from '../decorators/swagger/posts/create-post-by-blog-id-swagger.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsRepository: BlogsRepository,
    private postsQueryRepository: PostsQueryRepository
  ) {}

  @Get()
  @GetBlogsSwagger()
  async findAll(@Query() query: GetBlogsQueryDto) {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  @GetBlogSwagger()
  async getById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.blogsQueryRepository.findByIdOrThrow(id);
  }

  @Post()
  @CreateBlogSwagger()
  async create(@Body() dto: CreateBlogRequestDto) {
    const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(dto)
    );

    return this.blogsQueryRepository.findByIdOrThrow(blogId);
  }

  @Put(':id')
  @UpdateBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id', ObjectIdValidationPipe) id: string, @Body() dto: UpdateBlogRequestDto) {
    return this.commandBus.execute(
      new UpdateBlogCommand({
        blogId: id,
        ...dto,
      })
    );
  }

  @Delete(':id')
  @DeleteBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Get(':id/posts')
  @GetPostsByBlogIdSwagger()
  async getPostsForBlog(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetPostsQueryDto
  ) {
    await this.blogsRepository.getByIdOrFail(id);

    return this.postsQueryRepository.findAllForBlogId({ blogId: id, query });
  }

  @Post(':id/posts')
  @CreatePostByBlogIdSwagger()
  async createPost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: CreatePostByBlogIdRequestDto
  ) {
    const postId = await this.commandBus.execute(
      new CreatePostCommand({
        blogId: id,
        ...dto,
      })
    );

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }
}
