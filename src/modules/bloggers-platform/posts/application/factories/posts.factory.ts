import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../repository';
import { ICreatePostDto, PostViewMapper } from '../dto';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';

@Injectable()
export class PostsFactory {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(dto: ICreatePostDto) {
    const newPost = await this.postsRepository.create(dto);

    return PostViewMapper.mapToView({
      post: { ...newPost, likesCount: 0, dislikesCount: 0, myStatus: LikeStatus.None },
      newestLikes: [],
    });
  }
}
