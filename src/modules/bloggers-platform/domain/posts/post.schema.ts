import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreatePostRequestDto } from '../../dto/posts/create-post-request.dto';
import { UpdatePostRequestDto } from '../../dto/posts/update-post-request.dto';
import { LikesCountInfo } from '../likes/likes-count-info.schema';

@Schema({ timestamps: true, versionKey: false })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  createdAt: Date;

  @Prop({ type: LikesCountInfo, required: true })
  likesInfo: LikesCountInfo;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.static('createInstance', async function (blogName: string, dto: CreatePostRequestDto) {
  const post = new this();

  post.title = dto.title;
  post.shortDescription = dto.shortDescription;
  post.content = dto.content;
  post.blogId = dto.blogId;
  post.blogName = blogName;
  post.likesInfo.likesCount = 0;
  post.likesInfo.dislikesCount = 0;
  post.deletedAt = null;

  return post;
});

PostSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});

PostSchema.method('update', function (dto: UpdatePostRequestDto) {
  this.title = dto.title;
  this.shortDescription = dto.shortDescription;
  this.content = dto.content;
  this.blogId = dto.blogId;

  return this;
});
