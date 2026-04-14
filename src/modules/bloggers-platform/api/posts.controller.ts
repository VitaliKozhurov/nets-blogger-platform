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
import { GetCommentsByPostIdQueryDto } from './dto/comments/get-comments-by-post-id-query.dto';
import { GetCommentsByPostIdSwagger } from '../decorators/swagger/comments/get-comments-by-post-id-swagger.decorator';
import { CreateCommentRequestDto } from './dto/comments/create-comment.dto';
import { CreateCommentCommand } from '../application/use-cases/comments/create-comment.usecase';
import { UserFromRequest } from 'src/modules/users-account/decorators/user-from-request.decorator';
import { type RequestUserDto } from 'src/modules/users-account/application/dto/request-user.dto';
import { CreateCommentByPostIdSwagger } from '../decorators/swagger/comments/create-comment-by-post-id-swagger.decorator';
import { UpdatePostLikeStatusRequestDto } from './dto/posts/update-post-like-status.dto';
import { UpdatePostLikeStatusSwagger } from '../decorators/swagger/posts/update-post-like-status-swagger.dto';
import { UpdatePostLikeStatusCommand } from '../application/use-cases/posts/update-post-like-status.usecase';

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
  @GetCommentsByPostIdSwagger()
  async getPostComments(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetCommentsByPostIdQueryDto
  ) {
    return this.commentsQueryRepository.getAllByPostId({ postId: id, query });
  }

  @Post(':id/comments')
  @CreateCommentByPostIdSwagger()
  async createCommentForPost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: CreateCommentRequestDto,
    @UserFromRequest() userDto: RequestUserDto
  ) {
    const commentId = await this.commandBus.execute<CreateCommentCommand, string>(
      new CreateCommentCommand({
        id,
        ...dto,
        ...userDto,
      })
    );

    return this.commentsQueryRepository.findByIdOrThrow({ commentId });
  }

  @Put(':id/like-status')
  @UpdatePostLikeStatusSwagger()
  async updateLikeStatusForPost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdatePostLikeStatusRequestDto,
    @UserFromRequest() userDto: RequestUserDto
  ) {
    return this.commandBus.execute(
      new UpdatePostLikeStatusCommand({
        id,
        ...dto,
        ...userDto,
      })
    );
  }
}
