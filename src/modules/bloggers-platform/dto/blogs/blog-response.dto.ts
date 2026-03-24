import { BlogDocument } from '../../domain/blogs/blog.types';

export class BlogResponseDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static mapToView(blogDocument: BlogDocument): BlogResponseDto {
    const dto = new BlogResponseDto();

    dto.id = blogDocument._id.toString();
    dto.name = blogDocument.name;
    dto.description = blogDocument.description;
    dto.websiteUrl = blogDocument.websiteUrl;
    dto.createdAt = blogDocument.createdAt.toISOString();
    dto.isMembership = blogDocument.isMembership;

    return dto;
  }
}
