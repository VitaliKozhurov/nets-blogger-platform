import { BlogDocument } from '../../domain/blogs/blog.types';
import { IBlogResponseDto } from '../contracts/blog.dto';

export class BlogResponseMapperDto implements IBlogResponseDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static mapToView(blogDocument: BlogDocument): IBlogResponseDto {
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
