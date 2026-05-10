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
  CreatePostCommand,
  DeletePostCommand,
  UpdatePostCommand,
  UpdatePostLikeStatusCommand,
} from '@modules/bloggers-platform/posts/application/use-cases';
import { CreateCommentCommand } from '@modules/bloggers-platform/comments/application/use-cases';
import {
  CreatePostSwagger,
  DeletePostSwagger,
  GetPostSwagger,
  GetPostsSwagger,
  UpdatePostSwagger,
  UpdatePostLikeStatusSwagger,
} from '@modules/bloggers-platform/posts/decorators/swagger';
import {
  CreateCommentByPostIdSwagger,
  GetCommentsByPostIdSwagger,
} from '@modules/bloggers-platform/comments/decorators/swagger';
import { PostsQueryRepository, PostsRepository } from '@modules/bloggers-platform/posts/repository';
import { CommentsQueryRepository } from '@modules/bloggers-platform/comments/repository';
import {
  CreatePostRequestDto,
  GetPostsQueryDto,
  UpdatePostLikeStatusRequestDto,
  UpdatePostRequestDto,
} from '@modules/bloggers-platform/posts/api/dto';
import {
  CreateCommentRequestDto,
  GetCommentsByPostIdQueryDto,
} from '@modules/bloggers-platform/comments/api/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-bearer-guard.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { UserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/user-from-request.decorator';
import { UseBasicGuard } from 'src/modules/users-account/auth/decorators/basic-auth/use-basic-guard.decorator';
import { Public } from 'src/core/guards';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository
  ) {}

  @Get()
  @GetPostsSwagger()
  @UseOptionalBearerGuard()
  async findAll(
    @Query() query: GetPostsQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    return this.postsQueryRepository.findAll({ query, userId: userDto?.userId ?? undefined });
  }

  @Get(':id')
  @GetPostSwagger()
  @UseOptionalBearerGuard()
  async getById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    return this.postsQueryRepository.findByIdOrThrow({
      postId: id,
      userId: userDto?.userId ?? undefined,
    });
  }

  @Post()
  @UseBasicGuard()
  @CreatePostSwagger()
  async create(@Body() dto: CreatePostRequestDto) {
    const postId = await this.commandBus.execute<CreatePostCommand, string>(
      new CreatePostCommand(dto)
    );

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }

  @Put(':id')
  @UseBasicGuard()
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
  @UseBasicGuard()
  @DeletePostSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commandBus.execute(new DeletePostCommand(id));
  }

  @Get(':id/comments')
  @Public()
  @UseOptionalBearerGuard()
  @GetCommentsByPostIdSwagger()
  async getPostComments(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetCommentsByPostIdQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const post = await this.postsRepository.getById(id);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    return this.commentsQueryRepository.getAllByPostId({
      postId: id,
      query,
      userId: userDto?.userId ?? undefined,
    });
  }

  @Post(':id/comments')
  @UseBearerGuard()
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
  @UseBearerGuard()
  @UpdatePostLikeStatusSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
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
