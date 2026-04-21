import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blog.schema';
import { type BlogModelType } from '../../domain/blog.types';
import { ICreateBlogDto } from '../dto';

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
