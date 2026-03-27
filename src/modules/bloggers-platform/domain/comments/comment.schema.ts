import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesCountInfo } from '../likes/likes-count-info.schema';
import { CommentatorInfo } from './commentator-info.schema';

@Schema({ timestamps: true, versionKey: false })
export class Comment {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: CommentatorInfo, required: true })
  commentatorInfo: CommentatorInfo;

  createdAt: Date;

  @Prop({ type: LikesCountInfo, required: true })
  likesInfo: LikesCountInfo;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
