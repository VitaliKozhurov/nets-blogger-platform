import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from 'src/core/pipes';

import {
  GetPostSwagger,
  GetPostsSwagger,
} from '@modules/bloggers-platform/posts/decorators/swagger';

import { PostsQueryRepository } from '@modules/bloggers-platform/posts/repository';
import { GetPostsQueryDto } from '@modules/bloggers-platform/posts/api/dto';

import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { GetPostByIdQuery, GetPostsQuery } from '../application/queries';

@Controller('posts')
export class PostsController {
  constructor(
    private queryBus: QueryBus,
    private postsQueryRepository: PostsQueryRepository
  ) {}

  @Get()
  @GetPostsSwagger()
  @UseOptionalBearerGuard()
  async findAll(
    @Query() query: GetPostsQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    return this.queryBus.execute(
      new GetPostsQuery({ query, userId: userDto ? userDto.userId : undefined })
    );
  }

  @Get(':id')
  @GetPostSwagger()
  @UseOptionalBearerGuard()
  async getById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    return this.queryBus.execute(
      new GetPostByIdQuery({ postId: id, userId: userDto ? userDto.userId : undefined })
    );
  }
}
