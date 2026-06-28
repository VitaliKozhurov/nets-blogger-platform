import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../repository';
import { ICreatePostDto, PostViewMapper } from '../dto';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';
import { PostEntity } from '../../domain/post.entity';

@Injectable()
export class PostsFactory {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(dto: ICreatePostDto & { blogName: string }) {
    const { blogName, ...restDto } = dto;

    const newPost = PostEntity.createPost(restDto);
    const savedPost = await this.postsRepository.save(newPost);

    return PostViewMapper.mapToView({
      post: {
        id: savedPost.id,
        blogId: savedPost.blogId,
        blogName,
        title: savedPost.title,
        content: savedPost.content,
        shortDescription: savedPost.shortDescription,
        createdAt: savedPost.createdAt,
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
      newestLikes: [],
    });
  }
}
