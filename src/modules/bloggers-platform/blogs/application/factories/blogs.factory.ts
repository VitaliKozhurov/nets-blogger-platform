import { Injectable } from '@nestjs/common';
import { ICreateBlogDto } from '../dto';
import { BlogsRepository } from '../../repository';
import { BlogViewMapper } from '../dto/blog.mapper';
import { BlogEntity } from '../../domain/blog.entity';

@Injectable()
export class BlogsFactory {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(dto: ICreateBlogDto) {
    const newBlog = BlogEntity.createBlog(dto);

    const savedBlog = await this.blogsRepository.save(newBlog);

    return BlogViewMapper.mapToView(savedBlog);
  }
}
