import { HydratedDocument, Model } from 'mongoose';
import { Blog } from './blog.schema';

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument>;
