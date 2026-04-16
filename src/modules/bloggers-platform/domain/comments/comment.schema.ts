import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesCountInfo, LikesCountInfoSchema } from '../likes/likes-count-info.schema';
import { CommentatorInfo, CommentatorInfoSchema } from './commentator-info.schema';
import { LikeDocument } from '../likes/like.types';
import { LikeStatus } from '../likes/like.dto';
import { CreateCommentInstanceDto } from './comment.dto';

@Schema({ timestamps: true, versionKey: false })
export class Comment {
  id: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo: CommentatorInfo;

  createdAt: Date;

  @Prop({ type: LikesCountInfoSchema, required: true })
  likesInfo: LikesCountInfo;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.static('createInstance', function (dto: CreateCommentInstanceDto) {
  const comment = new this();

  comment.postId = dto.id;
  comment.content = dto.content;

  const commentatorInfo = {
    userId: dto.userId,
    userLogin: dto.login,
  };

  comment.commentatorInfo = commentatorInfo;
  comment.likesInfo = { likesCount: 0, dislikesCount: 0 };

  return comment;
});

CommentSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});

CommentSchema.method('updateContent', function (content: string) {
  this.content = content;
});

CommentSchema.method(
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

CommentSchema.method('applyIncomingLikeStatus', function (likeStatus: LikeStatus) {
  if (likeStatus === LikeStatus.Like) {
    this.likesInfo.likesCount += 1;
  }
  if (likeStatus === LikeStatus.Dislike) {
    this.likesInfo.dislikesCount += 1;
  }
});
