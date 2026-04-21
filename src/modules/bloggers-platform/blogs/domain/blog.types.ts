import { HydratedDocument, Model } from 'mongoose';
import { Blog } from './blog.schema';
import { CreateBlogInstanceDto, UpdateBlogDto } from './blog.dto';

export type BlogDocument = HydratedDocument<Blog, BlogMethodsType>;

export type BlogMethodsType = {
  softDelete(): void;
  update(dto: UpdateBlogDto): BlogDocument;
};

export type BlogStaticMethodsType = {
  createInstance(dto: CreateBlogInstanceDto): Promise<BlogDocument>;
};

export type BlogModelType = Model<BlogDocument, unknown, BlogMethodsType> & BlogStaticMethodsType;
