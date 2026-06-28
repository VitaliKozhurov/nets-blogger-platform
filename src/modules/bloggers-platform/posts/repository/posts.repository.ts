import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { IUpdatePostParamsDto } from './dto/update-post.params.dto';
import { IDeletePostParamsDto } from './dto/delete-post.params.dto';
import { PostEntity } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>
  ) {}

  async save(blog: PostEntity) {
    return this.postsRepo.save(blog);
  }

  async findById(id: string): Promise<PostEntity | null> {
    const post = await this.postsRepo.findOne({
      where: { id },
      withDeleted: false,
    });

    return post;
  }

  async update(dto: IUpdatePostParamsDto) {
    const { blogId, postId, title, shortDescription, content } = dto;

    const { affected } = await this.postsRepo.update(
      { blogId, id: postId, deletedAt: IsNull() },
      { title, shortDescription, content }
    );

    return affected === 1;
  }

  async softDelete(dto: IDeletePostParamsDto) {
    const { blogId, postId } = dto;

    const { affected } = await this.postsRepo.update(
      { blogId, id: postId, deletedAt: IsNull() },
      { deletedAt: new Date() }
    );

    return affected === 1;
  }
}
