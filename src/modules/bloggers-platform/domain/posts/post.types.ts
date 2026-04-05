import { HydratedDocument, Model } from 'mongoose';
import { Post } from './post.schema';
import { ICreatePostDto, IUpdatePostDto } from '../../dto/contracts/post.dto';

export type PostDocument = HydratedDocument<Post, PostMethodsType>;

export type PostMethodsType = {
  softDelete(): void;
  update(dto: IUpdatePostDto): PostDocument;
};

export type PostStaticMethodsType = {
  createInstance(blogId: string, dto: ICreatePostDto): Promise<PostDocument>;
};

export type PostModelType = Model<PostDocument, unknown, PostMethodsType> & PostStaticMethodsType;
