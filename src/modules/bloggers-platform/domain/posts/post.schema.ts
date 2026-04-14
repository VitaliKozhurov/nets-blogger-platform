import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LikesCountInfo, LikesCountInfoSchema } from '../likes/likes-count-info.schema';
import { CreatePostInstanceDto, UpdatePostDto } from './post.dto';
import { LikeStatus } from '../likes/like.dto';
import { LikeDocument } from '../likes/like.types';

@Schema({ timestamps: true, versionKey: false })
export class Post {
  id: string;

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

  @Prop({ type: LikesCountInfoSchema, required: true })
  likesInfo: LikesCountInfo;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.static('createInstance', async function (dto: CreatePostInstanceDto) {
  const post = new this();

  post.title = dto.title;
  post.shortDescription = dto.shortDescription;
  post.content = dto.content;
  post.blogId = dto.blogId;
  post.blogName = dto.blogName;
  post.likesInfo = { likesCount: 0, dislikesCount: 0 };
  post.deletedAt = null;

  return post;
});

PostSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});

PostSchema.method('update', function (dto: UpdatePostDto) {
  this.title = dto.title;
  this.shortDescription = dto.shortDescription;
  this.content = dto.content;
  this.blogId = dto.blogId;

  return this;
});

PostSchema.method(
  'updateLikesInfo',
  function (args: { currentLike: LikeDocument; nextLikeStatus: LikeStatus }) {
    const { currentLike, nextLikeStatus } = args;

    if (currentLike.status === nextLikeStatus) {
      return;
    }

    if (currentLike.status === LikeStatus.Like) {
      this.likesInfo.likesCount -= 1;
    }

    if (currentLike.status === LikeStatus.Dislike) {
      this.likesInfo.dislikesCount -= 1;
    }

    if (nextLikeStatus === LikeStatus.Like) {
      this.likesInfo.likesCount += 1;
    }

    if (nextLikeStatus === LikeStatus.Dislike) {
      this.likesInfo.dislikesCount += 1;
    }

    this.likesInfo.likesCount = Math.max(0, this.likesInfo.likesCount);
    this.likesInfo.dislikesCount = Math.max(0, this.likesInfo.dislikesCount);
  }
);

PostSchema.method('applyIncomingLikeStatus', function (likeStatus: LikeStatus) {
  if (likeStatus === LikeStatus.Like) {
    this.likesInfo.likesCount += 1;
  }
  if (likeStatus === LikeStatus.Dislike) {
    this.likesInfo.dislikesCount += 1;
  }
});
