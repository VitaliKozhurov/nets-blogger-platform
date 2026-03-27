import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/posts/post.schema';
import { type PostModelType } from '../domain/posts/post.types';
import { CreatePostRequestDto } from '../dto/posts/create-post-request.dto';
import { UpdatePostRequestDto } from '../dto/posts/update-post-request.dto';
import { BlogsRepository } from '../repository/blogs/blogs.repository';
import { PostsRepository } from '../repository/posts/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository
  ) {}

  async create(dto: CreatePostRequestDto) {
    const blog = await this.blogsRepository.getByIdOrFail(dto.blogId);

    const newPost = await this.PostModel.createInstance(blog._id.toString(), dto);

    await this.postsRepository.save(newPost);

    return newPost._id.toString();
  }

  async update(postId: string, dto: UpdatePostRequestDto) {
    const post = await this.postsRepository.getByIdOrFail(postId);

    const updatedPost = post.update(dto);

    await this.postsRepository.save(updatedPost);
  }

  async delete(id: string) {
    const post = await this.postsRepository.getByIdOrFail(id);

    post.softDelete();

    await this.postsRepository.save(post);
  }
}
