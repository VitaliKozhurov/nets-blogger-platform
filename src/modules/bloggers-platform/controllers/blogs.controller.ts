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
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../application/posts.service';

import {
  CreateBlogRequestBodyValidationDto,
  GetBlogsQueryParamsValidationDto,
  UpdateBlogRequestBodyValidationDto,
} from '../dto/validation/blog.validation';
import {
  CreatePostByBlogIdRequestBodyValidationDto,
  GetPostsQueryParamsValidationDto,
} from '../dto/validation/post.validation';
import { BlogsQueryRepository } from '../repository/blogs/blogs-query.repository';
import { BlogsRepository } from '../repository/blogs/blogs.repository';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsRepository: BlogsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsService: BlogsService,
    private postsService: PostsService
  ) {}

  @Get()
  async findAll(@Query() query: GetBlogsQueryParamsValidationDto) {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.blogsQueryRepository.findByIdOrThrow(id);
  }

  @Post()
  async create(@Body() dto: CreateBlogRequestBodyValidationDto) {
    const blogId = await this.blogsService.create(dto);

    return this.blogsQueryRepository.findByIdOrThrow(blogId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() dto: UpdateBlogRequestBodyValidationDto) {
    await this.blogsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }

  @Get(':id/posts')
  async getPostsForBlog(@Param('id') id: string, @Query() query: GetPostsQueryParamsValidationDto) {
    await this.blogsRepository.getByIdOrFail(id);

    return this.postsQueryRepository.findAllForBlogId({ blogId: id, query });
  }

  @Post(':id/posts')
  async createPost(
    @Param('id') id: string,
    @Body() dto: CreatePostByBlogIdRequestBodyValidationDto
  ) {
    const postId = await this.postsService.create({ blogId: id, ...dto });

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }
}
