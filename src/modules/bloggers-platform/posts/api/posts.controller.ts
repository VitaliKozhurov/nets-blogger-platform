import { GetPostsQueryDto } from '@modules/bloggers-platform/posts/api/dto';
import {
  GetPostSwagger,
  GetPostsSwagger,
} from '@modules/bloggers-platform/posts/decorators/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UUIDValidationPipe } from 'src/core/pipes';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import {
  OptionalUserFromRequest,
  UseOptionalBearerGuard,
} from 'src/modules/users-account/auth/decorators';
import { GetPostByIdQuery, GetPostsQuery } from '../application/queries';

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
    return this.queryBus.execute(
      new GetPostsQuery({ query, userId: userDto ? userDto.userId : undefined })
    );
  }

  @Get(':id')
  @GetPostSwagger()
  @UseOptionalBearerGuard()
  async getById(
    @Param('id', UUIDValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const commandQuery = { postId: id, userId: userDto ? userDto.userId : undefined };

    return this.queryBus.execute(new GetPostByIdQuery(commandQuery));
  }
}
