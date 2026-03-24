import { Blog } from './../../domain/blogs/blog.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, type BlogModelType } from '../../domain/blogs/blog.types';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {}

  async getById(id: string) {
    const user = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async save(blogDocument: BlogDocument) {
    await blogDocument.save();
  }
}
