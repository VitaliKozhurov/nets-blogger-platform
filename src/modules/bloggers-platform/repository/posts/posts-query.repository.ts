import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type PostModelType } from '../../domain/posts/post.types';
import { PostResponseDto } from '../../dto/posts/post-response.dto';
import { PaginationResponseDto } from 'src/core/dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType
  ) {}

  async getAll(): Promise<PaginationResponseDto<PostResponseDto[]>> {
    return {} as PaginationResponseDto<PostResponseDto[]>;
  }

  async getAllForBlog(blogId: string): Promise<PaginationResponseDto<PostResponseDto[]>> {
    return {} as PaginationResponseDto<PostResponseDto[]>;
  }

  async getByIdOrThrowNotFoundError(id: string): Promise<PostResponseDto> {
    return {} as PostResponseDto;
  }
}
