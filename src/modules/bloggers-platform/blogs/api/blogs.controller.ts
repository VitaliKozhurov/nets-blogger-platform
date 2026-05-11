import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UUIDValidationPipe } from 'src/core/pipes';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import {
  OptionalUserFromRequest,
  UseOptionalBearerGuard,
} from 'src/modules/users-account/auth/decorators';
import { GetBlogsQueryDto } from '../../blogs/api/dto';
import { GetPostsQueryDto } from '../../posts/api/dto';
import { GetBlogByIdQuery, GetBlogsQuery, GetPostsByBlogIdQuery } from '../application';
import { GetBlogSwagger, GetBlogsSwagger, GetPostsByBlogIdSwagger } from '../decorators/swagger';

@Controller('blogs')
export class BlogsController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @GetBlogsSwagger()
  async findAll(@Query() query: GetBlogsQueryDto) {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Get(':id')
  @GetBlogSwagger()
  async getById(@Param('id', UUIDValidationPipe) id: string) {
    return this.queryBus.execute(new GetBlogByIdQuery(id));
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
}
