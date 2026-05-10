import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../repository';
import { ICreatePostDto } from '../dto';

@Injectable()
export class PostsFactory {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(dto: ICreatePostDto) {
    const newPost = await this.postsRepository.create(dto);

    return newPost;
  }
}
