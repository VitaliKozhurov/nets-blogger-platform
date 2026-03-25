import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';
import { CreatePostRequestDto } from '../dto/posts/create-post-request.dto';
import { UpdatePostRequestDto } from '../dto/posts/update-post-request.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService
  ) {}

  @Get()
  async getAll() {
    return this.postsQueryRepository.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.postsQueryRepository.getByIdOrThrowNotFoundError(id);
  }

  @Post()
  async create(dto: CreatePostRequestDto) {
    const postId = await this.postsService.create(dto);

    return this.postsQueryRepository.getByIdOrThrowNotFoundError(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, dto: UpdatePostRequestDto) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Get(':id/comments')
  async getPostComments(@Param('id') id: string) {
    
  }
}
