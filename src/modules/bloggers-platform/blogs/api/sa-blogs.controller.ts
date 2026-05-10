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
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CreateBlogCommand, DeleteBlogCommand, UpdateBlogCommand } from '../application/use-cases';
import { CreatePostCommand } from '../../posts/application/use-cases';
import {
  CreateBlogSwagger,
  DeleteBlogSwagger,
  GetBlogsSwagger,
  GetPostsByBlogIdSwagger,
  UpdateBlogSwagger,
} from '../decorators/swagger';
import { CreatePostByBlogIdSwagger } from '@modules/bloggers-platform/posts/decorators/swagger';
import { PostsQueryRepository } from '../../posts/repository';
import { CreateBlogRequestDto, GetBlogsQueryDto, UpdateBlogRequestDto } from './dto';
import { CreatePostByBlogIdRequestDto, GetPostsQueryDto } from '../../posts/api/dto';
import { BlogsRepository } from '../repository/blogs.repository';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { UseBasicGuard } from 'src/modules/users-account/auth/decorators/basic-auth/use-basic-guard.decorator';
import { ApiBasicAuth } from '@nestjs/swagger';
import { GetBlogsQuery } from '../application';

@UseBasicGuard()
@ApiBasicAuth('basicAuth')
@Controller('sa/blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private blogsRepository: BlogsRepository,
    private postsQueryRepository: PostsQueryRepository
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
  async update(@Param('id', ObjectIdValidationPipe) id: string, @Body() dto: UpdateBlogRequestDto) {
    const commandDto = { blogId: id, ...dto };

    return this.commandBus.execute(new UpdateBlogCommand(commandDto));
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
