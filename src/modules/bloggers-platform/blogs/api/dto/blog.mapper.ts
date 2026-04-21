import { BlogDocument } from '@modules/bloggers-platform/blogs/domain';

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
