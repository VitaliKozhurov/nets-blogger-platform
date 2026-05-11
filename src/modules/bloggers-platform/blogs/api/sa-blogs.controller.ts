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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBasicAuth } from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/core/pipes';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import {
  OptionalUserFromRequest,
  UseBasicGuard,
  UseOptionalBearerGuard,
} from 'src/modules/users-account/auth/decorators';
import { GetPostsQueryDto, UpdatePostWithoutBlogIdRequestDto } from '../../posts/api/dto';
import {
  CreatePostCommand,
  DeletePostCommand,
  UpdatePostCommand,
} from '../../posts/application/use-cases';
import { GetBlogsQuery, GetPostsByBlogIdQuery } from '../application';
import { CreateBlogCommand, DeleteBlogCommand, UpdateBlogCommand } from '../application/use-cases';
import {
  CreateBlogSwagger,
  CreatePostByBlogSwagger,
  DeleteBlogSwagger,
  DeletePostByBlogSwagger,
  GetBlogsSwagger,
  GetPostsByBlogIdSwagger,
  UpdateBlogSwagger,
  UpdatePostByBlogSwagger,
} from '../decorators/swagger';
import { CreateBlogRequestDto, GetBlogsQueryDto, UpdateBlogRequestDto } from './dto';
import { CreatePostByBlogRequestDto } from './dto/create-post-by-blog.dto';

@ApiBasicAuth('basicAuth')
@UseBasicGuard()
@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get()
  @GetBlogsSwagger()
  async findAll(@Query() query: GetBlogsQueryDto) {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Post()
  @CreateBlogSwagger()
  async create(@Body() dto: CreateBlogRequestDto) {
    const createdBlog = await this.commandBus.execute(new CreateBlogCommand(dto));

    return createdBlog;
  }

  @Put(':id')
  @UpdateBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id', UUIDValidationPipe) id: string, @Body() dto: UpdateBlogRequestDto) {
    const commandDto = { blogId: id, ...dto };

    return this.commandBus.execute(new UpdateBlogCommand(commandDto));
  }

  @Delete(':id')
  @DeleteBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', UUIDValidationPipe) id: string) {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Post(':id/posts')
  @CreatePostByBlogSwagger()
  async createPost(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() dto: CreatePostByBlogRequestDto
  ) {
    const commandDto = { blogId: id, ...dto };

    return this.commandBus.execute(new CreatePostCommand(commandDto));
  }

  @Get(':id/posts')
  @GetPostsByBlogIdSwagger()
  @UseOptionalBearerGuard()
  async getPostsForBlog(
    @Param('id', UUIDValidationPipe) id: string,
    @Query() query: GetPostsQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const queryCommandDto = { blogId: id, query, userId: userDto ? userDto.userId : undefined };

    return this.queryBus.execute(new GetPostsByBlogIdQuery(queryCommandDto));
  }

  @Put(':id/posts/:postId')
  @UpdatePostByBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id', UUIDValidationPipe) id: string,
    @Param('postId', UUIDValidationPipe) postId: string,
    @Body() dto: UpdatePostWithoutBlogIdRequestDto
  ) {
    const commandDto = { blogId: id, postId, ...dto };

    return this.commandBus.execute(new UpdatePostCommand(commandDto));
  }

  @Delete(':id/posts/:postId')
  @DeletePostByBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id', UUIDValidationPipe) id: string,
    @Param('postId', UUIDValidationPipe) postId: string
  ) {
    const commandDto = { blogId: id, postId };

    return this.commandBus.execute(new DeletePostCommand(commandDto));
  }
}
