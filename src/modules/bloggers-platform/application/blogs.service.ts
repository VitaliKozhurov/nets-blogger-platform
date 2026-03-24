import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs/blog.schema';
import { type BlogModelType } from '../domain/blogs/blog.types';
import { BlogsRepository } from '../repository/blogs/blogs.repository';
import { CreateBlogRequestDto } from '../dto/blogs/create-blog-request.dto';
import { UpdateBlogRequestDto } from '../dto/blogs/update-blog-request.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogRepository: BlogsRepository
  ) {}

  async create(dto: CreateBlogRequestDto) {
    const newBlog = await this.BlogModel.createInstance(dto);

    await this.blogRepository.save(newBlog);

    return newBlog._id.toString();
  }

  async update(blogId: string, dto: UpdateBlogRequestDto) {
    const blog = await this.blogRepository.getById(blogId);

    const updatedBlog = blog.update(dto);

    await this.blogRepository.save(updatedBlog);
  }

  async delete(id: string) {
    const blog = await this.blogRepository.getById(id);

    blog.softDelete();

    await this.blogRepository.save(blog);
  }
}
