import { IBlogRepository } from '../../repository';

export class BlogResponseMapperDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static mapToView(dbBlog: IBlogRepository): BlogResponseMapperDto {
    const dto = new BlogResponseMapperDto();

    dto.id = dbBlog.id;
    dto.name = dbBlog.name;
    dto.description = dbBlog.description;
    dto.websiteUrl = dbBlog.websiteUrl;
    dto.createdAt = dbBlog.createdAt.toISOString();
    dto.isMembership = dbBlog.isMembership;

    return dto;
  }
}
