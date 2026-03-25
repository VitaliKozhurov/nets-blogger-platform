import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/posts/post.schema';
import { type PostModelType } from '../domain/posts/post.types';
import { CreatePostRequestDto } from '../dto/posts/create-post-request.dto';
import { UpdatePostRequestDto } from '../dto/posts/update-post-request.dto';
import { PostsRepository } from '../repository/posts/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postRepository: PostsRepository
  ) {}

  async create(dto: CreatePostRequestDto) {}

  async update(postId: string, dto: UpdatePostRequestDto) {}

  async delete(id: string) {
    const post = await this.postRepository.getById(id);

    post.softDelete();

    await this.postRepository.save(post);
  }
}
