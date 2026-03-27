import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blogs/blog.schema';
import { type BlogModelType } from '../../domain/blogs/blog.types';

@Injectable()
export class BlogsExternalRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {}

  async delete() {
    await this.BlogModel.deleteMany();
  }
}
