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
import { PostsService } from '../application/posts.service';
import { GetCommentsByPostIdQueryParamsDto } from '../dto/comments/get-comments-by-post-id-query-params.dto';
import { CreatePostRequestDto } from '../dto/posts/create-post-request.dto';
import { GetPostsQueryParamsDto } from '../dto/posts/get-posts-query-params.dto';
import { UpdatePostRequestDto } from '../dto/posts/update-post-request.dto';
import { CommentsQueryRepository } from '../repository/comments/comments-query.repository';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private postsService: PostsService
  ) {}

  @Get()
  async findAll(@Query() query: GetPostsQueryParamsDto) {
    return this.postsQueryRepository.findAll({ query });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.postsQueryRepository.findByIdOrThrow({ postId: id });
  }

  @Post()
  async create(@Body() dto: CreatePostRequestDto) {
    const postId = await this.postsService.create(dto);

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() dto: UpdatePostRequestDto) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') id: string,
    @Query() query: GetCommentsByPostIdQueryParamsDto
  ) {
    return this.commentsQueryRepository.getAllByPostId({ postId: id, query });
  }
}
