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
import { PostsService } from '../application/posts.service';

import {
  CreatePostByBlogIdRequestBodyValidationDto,
  GetPostsQueryParamsValidationDto,
} from '../dto/validation/post.validation';
import { BlogsQueryRepository } from '../repository/blogs/blogs-query.repository';
import { BlogsRepository } from '../repository/blogs/blogs.repository';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/blogs/create-blog.usecase';
import { UpdateBlogCommand } from '../application/use-cases/blogs/update-blog.usecase';
import { DeleteBlogCommand } from '../application/use-cases/blogs/delete-blog.usecase.dto';
import { CreateBlogRequestDto } from './dto/blogs/create-blog.dto';
import { CreateBlogSwagger } from '../decorators/swagger/blogs/create-blog-swagger.decorator';
import { UpdateBlogRequestDto } from './dto/blogs/update-blog.dto';
import { UpdateBlogSwagger } from '../decorators/swagger/blogs/update-blog-swagger.dto';
import { DeleteBlogSwagger } from '../decorators/swagger/blogs/delete-blog-swagger.decorator';
import { GetBlogsQueryDto } from './dto/blogs/get-blogs-query.dto';
import { GetBlogsSwagger } from '../decorators/swagger/blogs/get-blogs-swagger.decorator';
import { GetBlogSwagger } from '../decorators/swagger/blogs/get-blog-swagger.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsRepository: BlogsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService
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

  // TODO add use cases
  @Get(':id/posts')
  async getPostsForBlog(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetPostsQueryParamsValidationDto
  ) {
    await this.blogsRepository.getByIdOrFail(id);

    return this.postsQueryRepository.findAllForBlogId({ blogId: id, query });
  }

  @Post(':id/posts')
  async createPost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: CreatePostByBlogIdRequestBodyValidationDto
  ) {
    const postId = await this.postsService.create({ blogId: id, ...dto });

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }
}
