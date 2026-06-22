import { BlogEntity } from '../../domain/blog.entity';

export class BlogViewMapper {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static mapToView(dbBlog: BlogEntity): BlogViewMapper {
    const dto = new BlogViewMapper();

    dto.id = dbBlog.id;
    dto.name = dbBlog.name;
    dto.description = dbBlog.description;
    dto.websiteUrl = dbBlog.websiteUrl;
    dto.createdAt = dbBlog.createdAt.toISOString();
    dto.isMembership = dbBlog.isMembership;

    return dto;
  }
}

export interface IBlogViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
