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
import {
  CreatePostRequestBodyValidationDto,
  GetPostsQueryParamsValidationDto,
  UpdatePostRequestBodyValidationDto,
} from '../dto/validation/post.validation';
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
  async findAll(@Query() query: GetPostsQueryParamsValidationDto) {
    return this.postsQueryRepository.findAll({ query });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.postsQueryRepository.findByIdOrThrow({ postId: id });
  }

  @Post()
  async create(@Body() dto: CreatePostRequestBodyValidationDto) {
    const postId = await this.postsService.create(dto);

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() dto: UpdatePostRequestBodyValidationDto) {
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
