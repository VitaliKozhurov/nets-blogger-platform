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
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { PostsService } from '../application/posts.service';
import { CreatePostSwagger } from '../decorators/swagger/posts/create-post-swagger.decorator';
import { GetCommentsByPostIdQueryParamsValidationDto } from '../dto/validation/comment.validation';
import { GetPostsQueryParamsValidationDto } from '../dto/validation/post.validation';
import { CommentsQueryRepository } from '../repository/comments/comments-query.repository';
import { PostsQueryRepository } from '../repository/posts/posts-query.repository';
import { CreatePostRequestDto } from './dto/posts/create-post.dto';

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
  async getById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsQueryRepository.findByIdOrThrow({ postId: id });
  }

  @Post()
  @CreatePostSwagger()
  async create(@Body() dto: CreatePostRequestDto) {
    const postId = await this.postsService.create(dto);

    return this.postsQueryRepository.findByIdOrThrow({ postId });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdatePostRequestBodyValidationDto
  ) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsService.delete(id);
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetCommentsByPostIdQueryParamsValidationDto
  ) {
    return this.commentsQueryRepository.getAllByPostId({ postId: id, query });
  }
}
