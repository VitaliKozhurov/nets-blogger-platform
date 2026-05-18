import { GetPostsQueryDto } from '@modules/bloggers-platform/posts/api/dto';
import {
  GetPostSwagger,
  GetPostsSwagger,
} from '@modules/bloggers-platform/posts/decorators/swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
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
import { GetPostByIdQuery, GetPostsQuery } from '../application/queries';
import { CreateCommentByPostRequestDto } from './dto/create-comment-by-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private queryBus: QueryBus) {}

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

  @Get(':id')
  @GetPostSwagger()
  @UseOptionalBearerGuard()
  async getPostComments(
    @Query() query: GetCommentsByPostIdQueryDto,
    @Param('id', UUIDValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const commandQueryDto = { postId: id, userId: userDto ? userDto.userId : undefined, query };

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

    return this.queryBus.execute(new GetPostByIdQuery(commandDto));
  }
}
