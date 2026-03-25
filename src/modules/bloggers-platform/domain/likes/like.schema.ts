import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../types/likes/like-status.types';

@Schema({ timestamps: true, versionKey: false })
export class Like {
  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  parentId: string;

  createdAt: Date;

  @Prop({ type: Number, required: true, enum: LikeStatus, default: LikeStatus.None })
  status: LikeStatus;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
