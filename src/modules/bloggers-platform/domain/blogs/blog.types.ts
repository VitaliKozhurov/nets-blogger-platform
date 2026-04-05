import { HydratedDocument, Model } from 'mongoose';
import { ICreateBlogDto, IUpdateBlogDto } from '../../dto/contracts/blog.dto';
import { Blog } from './blog.schema';

export type BlogDocument = HydratedDocument<Blog, BlogMethodsType>;

export type BlogMethodsType = {
  softDelete(): void;
  update(dto: IUpdateBlogDto): BlogDocument;
};

export type BlogStaticMethodsType = {
  createInstance(dto: ICreateBlogDto): Promise<BlogDocument>;
};

export type BlogModelType = Model<BlogDocument, unknown, BlogMethodsType> & BlogStaticMethodsType;
