import {
  GetPostsQueryDto,
  UpdatePostLikeStatusRequestDto,
} from '@modules/bloggers-platform/posts/api/dto';
import {
  GetPostSwagger,
  GetPostsSwagger,
} from '@modules/bloggers-platform/posts/decorators/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/core/pipes';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import {
  OptionalUserFromRequest,
  UseBearerGuard,
  UseOptionalBearerGuard,
  UserFromRequest,
} from 'src/modules/users-account/auth/decorators';
import { GetCommentsByPostIdQueryDto } from '../../comments';
import { CreateCommentByPostCommand, UpdatePostLikeStatusCommand } from '../application';
import { GetPostByIdQuery, GetPostCommentsQuery, GetPostsQuery } from '../application/queries';
import { CreateCommentByPostRequestDto } from './dto/create-comment-by-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get()
  @GetPostsSwagger()
  @UseOptionalBearerGuard()
  async findAll(
    @Query() query: GetPostsQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const queryCommandDto = { query, userId: userDto ? userDto.userId : undefined };

    return this.queryBus.execute(new GetPostsQuery(queryCommandDto));
  }

  @Get(':id')
  @GetPostSwagger()
  @UseOptionalBearerGuard()
  async getById(
    @Param('id', UUIDValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const commandQueryDto = { postId: id, userId: userDto ? userDto.userId : undefined };

    return this.queryBus.execute(new GetPostByIdQuery(commandQueryDto));
  }

  @Post(':id/comments')
  @ApiBearerAuth('bearerAuth')
  @UseBearerGuard()
  async createCommentByPost(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() body: CreateCommentByPostRequestDto,
    @UserFromRequest() dto: RequestUserDto
  ) {
    const commandDto = { postId: id, userId: dto.userId, login: dto.login, content: body.content };

    return this.commandBus.execute(new CreateCommentByPostCommand(commandDto));
  }

  @Get(':id/comments')
  @GetPostSwagger()
  @UseOptionalBearerGuard()
  async getPostComments(
    @Query() query: GetCommentsByPostIdQueryDto,
    @Param('id', UUIDValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const commandQueryDto = { postId: id, userId: userDto ? userDto.userId : undefined, query };

    return this.queryBus.execute(new GetPostCommentsQuery(commandQueryDto));
  }

  @Put(':id/like-status')
  @ApiBearerAuth('bearerAuth')
  @UseBearerGuard()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostLikeStatus(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() body: UpdatePostLikeStatusRequestDto,
    @UserFromRequest() dto: RequestUserDto
  ) {
    const commandDto = { postId: id, userId: dto.userId, likeStatus: body.likeStatus };

    return this.commandBus.execute(new UpdatePostLikeStatusCommand(commandDto));
  }
}
