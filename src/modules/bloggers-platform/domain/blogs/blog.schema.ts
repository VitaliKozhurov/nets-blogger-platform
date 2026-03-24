import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  createdAt: Date;

  @Prop({ type: Boolean, required: true })
  isMembership: boolean;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
