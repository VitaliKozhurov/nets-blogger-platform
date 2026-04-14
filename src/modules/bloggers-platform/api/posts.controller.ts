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
import { type RequestUserDto } from 'src/modules/users-account/contracts';
import { UserFromRequest } from 'src/modules/users-account/decorators';
import {
  CreateCommentCommand,
  CreatePostCommand,
  DeletePostCommand,
  UpdatePostCommand,
  UpdatePostLikeStatusCommand,
} from '../application/use-cases';
import {
  CreateCommentByPostIdSwagger,
  GetCommentsByPostIdSwagger,
  CreatePostSwagger,
  DeletePostSwagger,
  GetPostSwagger,
  GetPostsSwagger,
  UpdatePostSwagger,
  UpdatePostLikeStatusSwagger,
} from '../decorators/swagger';
import { CommentsQueryRepository, PostsQueryRepository } from '../repository';
import {
  CreateCommentRequestDto,
  CreatePostRequestDto,
  GetCommentsByPostIdQueryDto,
  GetPostsQueryDto,
  UpdatePostLikeStatusRequestDto,
  UpdatePostRequestDto,
} from './dto';

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
