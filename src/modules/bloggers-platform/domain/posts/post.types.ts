import { HydratedDocument, Model } from 'mongoose';
import { CreatePostInstanceDto, UpdatePostDto } from './post.dto';
import { Post } from './post.schema';

export type PostDocument = HydratedDocument<Post, PostMethodsType>;

export type PostMethodsType = {
  softDelete(): void;
  update(dto: UpdatePostDto): PostDocument;
};

export type PostStaticMethodsType = {
  createInstance(dto: CreatePostInstanceDto): Promise<PostDocument>;
};

export type PostModelType = Model<PostDocument, unknown, PostMethodsType> & PostStaticMethodsType;
