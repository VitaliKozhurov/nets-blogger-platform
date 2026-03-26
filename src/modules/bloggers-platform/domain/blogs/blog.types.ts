import { HydratedDocument, Model } from 'mongoose';
import { Blog } from './blog.schema';
import { CreateBlogRequestDto } from '../../dto/blogs/create-blog-request.dto';
import { UpdateBlogRequestDto } from '../../dto/blogs/update-blog-request.dto';

export type BlogDocument = HydratedDocument<Blog, BlogMethodsType>;

export type BlogMethodsType = {
  softDelete(): void;
  update(dto: UpdateBlogRequestDto): BlogDocument;
};

export type BlogStaticMethodsType = {
  createInstance(dto: CreateBlogRequestDto): BlogDocument;
};

export type BlogModelType = Model<Blog, unknown, BlogMethodsType> & BlogStaticMethodsType;
