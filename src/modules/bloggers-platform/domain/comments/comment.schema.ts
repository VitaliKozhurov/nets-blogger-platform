import { Prop, Schema } from '@nestjs/mongoose';
import { CommentatorInfo } from './commentator-info.schema';
import { LikesCountInfo } from '../likes/likes-count-info.schema';

@Schema({ timestamps: true, versionKey: false })
export class Comment {
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
