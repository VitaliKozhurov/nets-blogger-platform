import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blogs/blog.schema';
import { type BlogModelType } from '../../domain/blogs/blog.types';
import { ICreateBlogDto } from '../dto/blogs/create-blog.dto';

@Injectable()
export class BlogsFactory {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {}

  async createBlog(dto: ICreateBlogDto) {
    const newBlog = await this.BlogModel.createInstance(dto);

    return newBlog;
  }
}
