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
  DeleteBlogCommand,
  UpdateBlogCommand,
} from '@modules/bloggers-platform/blogs/application/use-cases';
import { CreatePostCommand } from '@modules/bloggers-platform/posts/application/use-cases';
import {
  CreateBlogSwagger,
  DeleteBlogSwagger,
  GetBlogSwagger,
  GetBlogsSwagger,
  GetPostsByBlogIdSwagger,
  UpdateBlogSwagger,
} from '@modules/bloggers-platform/blogs/decorators/swagger';
import { CreatePostByBlogIdSwagger } from '@modules/bloggers-platform/posts/decorators/swagger';
import { PostsQueryRepository } from '@modules/bloggers-platform/posts/repository';
import {
  CreateBlogRequestDto,
  GetBlogsQueryDto,
  UpdateBlogRequestDto,
} from '@modules/bloggers-platform/blogs/api/dto';
import {
  CreatePostByBlogIdRequestDto,
  GetPostsQueryDto,
} from '@modules/bloggers-platform/posts/api/dto';

import { BlogsQueryRepository } from '../repository/blogs-query.repository';
import { BlogsRepository } from '../repository/blogs.repository';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { UseBasicGuard } from 'src/modules/users-account/auth/decorators/basic-auth/use-basic-guard.decorator';

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
  @UseOptionalBearerGuard()
  async getPostsForBlog(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetPostsQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    await this.blogsRepository.getByIdOrFail(id);

    return this.postsQueryRepository.findAllForBlogId({
      blogId: id,
      query,
      userId: userDto?.userId ?? undefined,
    });
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
