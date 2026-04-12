import { BlogDocument } from 'src/modules/bloggers-platform/domain/blogs/blog.types';

export class BlogResponseMapperDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static mapToView(blogDocument: BlogDocument): BlogResponseMapperDto {
    const dto = new BlogResponseMapperDto();

    dto.id = blogDocument._id.toString();
    dto.name = blogDocument.name;
    dto.description = blogDocument.description;
    dto.websiteUrl = blogDocument.websiteUrl;
    dto.createdAt = blogDocument.createdAt.toISOString();
    dto.isMembership = blogDocument.isMembership;

    return dto;
  }
}
