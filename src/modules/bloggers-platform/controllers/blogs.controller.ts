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
import { BlogsQueryRepository } from '../repository/blogs/blogs-query.repository';
import { BlogsService } from '../application/blogs.service';
import { GetBlogsQueryParamsDto } from '../dto/blogs/get-blogs-query-params.dto';
import { CreateBlogRequestDto } from '../dto/blogs/create-blog-request.dto';
import { UpdateBlogRequestDto } from '../dto/blogs/update-blog-request.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService
  ) {}

  @Get()
  async getAll(@Query() query: GetBlogsQueryParamsDto) {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.blogsQueryRepository.getByIdOrThrowNotFoundError(id);
  }

  @Post()
  async create(@Body() dto: CreateBlogRequestDto) {
    const userId = await this.blogsService.create(dto);

    return this.blogsQueryRepository.getByIdOrThrowNotFoundError(userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() dto: UpdateBlogRequestDto) {
    await this.blogsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
