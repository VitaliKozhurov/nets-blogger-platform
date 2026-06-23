import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { IUpdateBlogParamsDto } from './dto/update-blog.params.dto';
import { BlogEntity } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(BlogEntity) private blogsRepo: Repository<BlogEntity>
  ) {}

  async save(blog: BlogEntity) {
    return this.blogsRepo.save(blog);
  }

  async findById(id: string): Promise<BlogEntity | null> {
    const [blog]: BlogEntity[] = await this.dataSource.query(
      `
          SELECT *
            FROM blogs
            WHERE id=$1 AND "deletedAt" IS NULL
        `,
      [id]
    );

    return blog || null;
  }

  async update(dto: IUpdateBlogParamsDto): Promise<boolean> {
    const { blogId, name, description, websiteUrl } = dto;

    const { affected } = await this.blogsRepo.update(
      { id: blogId, deletedAt: IsNull() },
      { name, description, websiteUrl }
    );

    return affected === 1;
  }

  async softDelete(blogId: string) {
    const { affected } = await this.blogsRepo.update(
      { id: blogId, deletedAt: IsNull() },
      { deletedAt: new Date() }
    );

    return affected === 1;
  }
}
