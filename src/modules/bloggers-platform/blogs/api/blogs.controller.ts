import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe, UUIDValidationPipe } from 'src/core/pipes';
import { GetBlogSwagger, GetBlogsSwagger, GetPostsByBlogIdSwagger } from '../decorators/swagger';
import { GetBlogsQueryDto } from '../../blogs/api/dto';
import { GetPostsQueryDto } from '../../posts/api/dto';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { GetBlogByIdQuery, GetBlogsQuery, GetPostsByBlogIdQuery } from '../application';

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
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetPostsQueryDto,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    return this.queryBus.execute(
      new GetPostsByBlogIdQuery({
        blogId: id,
        query,
        userId: userDto ? userDto.userId : undefined,
      })
    );
  }
}
