import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateBlogRequestDto } from '../../dto/blogs/create-blog-request.dto';
import { UpdateBlogRequestDto } from '../../dto/blogs/update-blog-request.dto';

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

BlogSchema.static('createInstance', async function (dto: CreateBlogRequestDto) {
  const blog = new this();

  blog.name = dto.name;
  blog.description = dto.description;
  blog.websiteUrl = dto.websiteUrl;
  blog.isMembership = true;
  blog.deletedAt = null;

  return blog;
});

BlogSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});

BlogSchema.method('update', function (dto: UpdateBlogRequestDto) {
  this.name = dto.name;
  this.description = dto.description;
  this.websiteUrl = dto.websiteUrl;

  return this;
});
