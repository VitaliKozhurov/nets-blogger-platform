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
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CreatePostSwagger } from '../decorators/swagger/posts/create-post-swagger.decorator';
import { GetCommentsByPostIdQueryParamsValidationDto } from '../dto/validation/comment.validation';
import { CommentsQueryRepository } from '../repository/comments/comments-query.repository';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';
import { CreatePostRequestDto } from './dto/posts/create-post.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/use-cases/posts/create-post.usecase';
import { UpdatePostRequestDto } from './dto/posts/update-post.dto';
import { UpdatePostCommand } from '../application/use-cases/posts/update-post.usecase';
import { UpdatePostSwagger } from '../decorators/swagger/posts/update-post-swagger.decorator';
import { DeletePostCommand } from '../application/use-cases/posts/delete-post.usecase';
import { DeletePostSwagger } from '../decorators/swagger/posts/delete-post-swagger.decorator';
import { GetPostsQueryDto } from './dto/posts/get-posts-query.dto';
import { GetPostsSwagger } from '../decorators/swagger/posts/get-posts-swagger.decorator';
import { GetPostSwagger } from '../decorators/swagger/posts/get-post-swagger.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository
  ) {}

  @Get()
  @GetPostsSwagger()
  async findAll(@Query() query: GetPostsQueryDto) {
    return this.postsQueryRepository.findAll({ query });
  }

  @Get(':id')
  @GetPostSwagger()
  async getById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsQueryRepository.findByIdOrThrow({ postId: id });
  }

  @Post()
  @CreatePostSwagger()
  async create(@Body() dto: CreatePostRequestDto) {
    const postId = await this.commandBus.execute<CreatePostCommand, string>(
      new CreatePostCommand(dto)
    );

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }

  @Put(':id')
  @UpdatePostSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id', ObjectIdValidationPipe) id: string, @Body() dto: UpdatePostRequestDto) {
    return this.commandBus.execute(
      new UpdatePostCommand({
        postId: id,
        ...dto,
      })
    );
  }

  @Delete(':id')
  @DeletePostSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commandBus.execute(new DeletePostCommand(id));
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetCommentsByPostIdQueryParamsValidationDto
  ) {
    return this.commentsQueryRepository.getAllByPostId({ postId: id, query });
  }
}
