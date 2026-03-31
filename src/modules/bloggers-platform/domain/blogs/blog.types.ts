import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogRequestDto } from '../../dto/blogs/create-blog-request.dto';
import { UpdateBlogRequestDto } from '../../dto/blogs/update-blog-request.dto';
import { Blog } from './blog.schema';

export type BlogDocument = HydratedDocument<Blog, BlogMethodsType>;

export type BlogMethodsType = {
  softDelete(): void;
  update(dto: UpdateBlogRequestDto): BlogDocument;
};

export type BlogStaticMethodsType = {
  createInstance(dto: CreateBlogRequestDto): Promise<BlogDocument>;
};

export type BlogModelType = Model<BlogDocument, unknown, BlogMethodsType> & BlogStaticMethodsType;
