import { Injectable } from '@nestjs/common';
import { ICreateBlogDto } from '../dto';
import { BlogsRepository } from '../../repository';
import { BlogViewMapper } from '../dto/blog.mapper';

@Injectable()
export class BlogsFactory {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(dto: ICreateBlogDto) {
    const newBlog = await this.blogsRepository.create(dto);

    return BlogViewMapper.mapToView(newBlog);
  }
}
