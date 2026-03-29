import { HydratedDocument, Model } from 'mongoose';
import { CreatePostRequestDto } from '../../dto/posts/create-post-request.dto';
import { UpdatePostRequestDto } from '../../dto/posts/update-post-request.dto';
import { Post } from './post.schema';

export type PostDocument = HydratedDocument<Post, PostMethodsType>;

export type PostMethodsType = {
  softDelete(): void;
  update(dto: UpdatePostRequestDto): PostDocument;
};

export type PostStaticMethodsType = {
  createInstance(blogId: string, dto: CreatePostRequestDto): Promise<PostDocument>;
};

export type PostModelType = Model<Post, unknown, PostMethodsType> & PostStaticMethodsType;
