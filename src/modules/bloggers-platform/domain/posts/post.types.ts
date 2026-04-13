import { HydratedDocument, Model } from 'mongoose';
import { IUpdatePostDto } from '../../dto/contracts/post.dto';
import { CreatePostInstanceDto } from './post.dto';
import { Post } from './post.schema';

export type PostDocument = HydratedDocument<Post, PostMethodsType>;

export type PostMethodsType = {
  softDelete(): void;
  update(dto: IUpdatePostDto): PostDocument;
};

export type PostStaticMethodsType = {
  createInstance(dto: CreatePostInstanceDto): Promise<PostDocument>;
};

export type PostModelType = Model<PostDocument, unknown, PostMethodsType> & PostStaticMethodsType;
