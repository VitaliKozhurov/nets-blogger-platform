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
import {
  CreateBlogCommand,
  CreatePostCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
} from '../application/use-cases';
import {
  CreateBlogSwagger,
  CreatePostByBlogIdSwagger,
  DeleteBlogSwagger,
  GetBlogSwagger,
  GetBlogsSwagger,
  GetPostsByBlogIdSwagger,
  UpdateBlogSwagger,
} from '../decorators/swagger';
import { BlogsQueryRepository, BlogsRepository, PostsQueryRepository } from '../repository';
import {
  CreateBlogRequestDto,
  CreatePostByBlogIdRequestDto,
  GetBlogsQueryDto,
  GetPostsQueryDto,
  UpdateBlogRequestDto,
} from './dto';
import { UseBasicGuard } from 'src/modules/users-account/decorators';

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
  @UseBasicGuard()
  @CreateBlogSwagger()
  async create(@Body() dto: CreateBlogRequestDto) {
    const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(dto)
    );

    return this.blogsQueryRepository.findByIdOrThrow(blogId);
  }

  @Put(':id')
  @UseBasicGuard()
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
  @UseBasicGuard()
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
  @UseBasicGuard()
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
