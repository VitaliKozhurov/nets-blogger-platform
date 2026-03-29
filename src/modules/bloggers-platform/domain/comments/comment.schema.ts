import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesCountInfo, LikesCountInfoSchema } from '../likes/likes-count-info.schema';
import { CommentatorInfo, CommentatorInfoSchema } from './commentator-info.schema';

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
