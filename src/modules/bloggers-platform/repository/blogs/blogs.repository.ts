import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { BlogDocument, type BlogModelType } from '../../domain/blogs/blog.types';
import { Blog } from './../../domain/blogs/blog.schema';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {}

  async getByIdOrFail(id: string) {
    const user = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return user;
  }

  async save(blogDocument: BlogDocument) {
    await blogDocument.save();
  }
}
