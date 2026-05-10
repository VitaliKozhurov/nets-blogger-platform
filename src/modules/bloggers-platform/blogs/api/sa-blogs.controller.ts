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
import { UUIDValidationPipe } from 'src/core/pipes';
import { CreateBlogCommand, DeleteBlogCommand, UpdateBlogCommand } from '../application/use-cases';
import { CreatePostCommand, UpdatePostCommand } from '../../posts/application/use-cases';
import {
  CreateBlogSwagger,
  DeleteBlogSwagger,
  GetBlogsSwagger,
  GetPostsByBlogIdSwagger,
  UpdateBlogSwagger,
} from '../decorators/swagger';
import { CreatePostByBlogIdSwagger } from '@modules/bloggers-platform/posts/decorators/swagger';
import { CreateBlogRequestDto, GetBlogsQueryDto, UpdateBlogRequestDto } from './dto';
import {
  CreatePostWithoutBlogIdRequestDto,
  GetPostsQueryDto,
  UpdatePostWithoutBlogIdRequestDto,
} from '../../posts/api/dto';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { UseBasicGuard } from 'src/modules/users-account/auth/decorators/basic-auth/use-basic-guard.decorator';
import { ApiBasicAuth } from '@nestjs/swagger';
import { GetBlogsQuery, GetPostsByBlogIdQuery } from '../application';

@UseBasicGuard()
@ApiBasicAuth('basicAuth')
@Controller('sa/blogs')
export class BlogsController {
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
  @CreatePostByBlogIdSwagger()
  async createPost(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() dto: CreatePostWithoutBlogIdRequestDto
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
    const queryCommandDto = {
      blogId: id,
      query,
      userId: userDto ? userDto.userId : undefined,
    };

    return this.queryBus.execute(new GetPostsByBlogIdQuery(queryCommandDto));
  }

  @Put(':id/posts/:postId')
  @UpdateBlogSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id', UUIDValidationPipe) id: string,
    @Param('postId', UUIDValidationPipe) postId: string,
    @Body() dto: UpdatePostWithoutBlogIdRequestDto
  ) {
    const commandDto = { blogId: id, postId, ...dto };

    return this.commandBus.execute(new UpdatePostCommand(commandDto));
  }
}
