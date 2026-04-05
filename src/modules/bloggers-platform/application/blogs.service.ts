import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs/blog.schema';
import { type BlogModelType } from '../domain/blogs/blog.types';
import { ICreateBlogDto, IUpdateBlogDto } from '../dto/contracts/blog.dto';
import { BlogsRepository } from '../repository/blogs/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogRepository: BlogsRepository
  ) {}

  async create(dto: ICreateBlogDto) {
    const newBlog = await this.BlogModel.createInstance(dto);

    await this.blogRepository.save(newBlog);

    return newBlog._id.toString();
  }

  async update(blogId: string, dto: IUpdateBlogDto) {
    const blog = await this.blogRepository.getByIdOrFail(blogId);

    const updatedBlog = blog.update(dto);

    await this.blogRepository.save(updatedBlog);
  }

  async delete(id: string) {
    const blog = await this.blogRepository.getByIdOrFail(id);

    blog.softDelete();

    await this.blogRepository.save(blog);
  }
}
