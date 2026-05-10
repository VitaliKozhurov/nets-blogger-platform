import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IBlogRepositoryDto } from './dto/blog-repository.dto';
import { BlogResponseMapperDto } from '../api';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(id: string): Promise<IBlogRepositoryDto | null> {
    const [blog]: IBlogRepositoryDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM blogs
            WHERE id=$1 AND "deletedAt" IS NULL
        `,
      [id]
    );

    return blog || null;
  }

  async create(dto: { name: string; description: string; websiteUrl: string }) {
    const { name, description, websiteUrl } = dto;

    const [blog]: IBlogRepositoryDto[] = await this.dataSource.query(
      `
          INSERT INTO blogs (name, description, "websiteUrl")
            VALUES ($1, $2, $3)
            RETURNING *
        `,
      [name, description, websiteUrl]
    );

    return BlogResponseMapperDto.mapToView(blog);
  }

  async update(dto: { blogId: string; name: string; description: string; websiteUrl: string }) {
    const { blogId, name, description, websiteUrl } = dto;

    const [blog]: IBlogRepositoryDto[] = await this.dataSource.query(
      `
          UPDATE blogs
            SET name = $1,
                description = $2,
                "websiteUrl" = $3
            WHERE blogs.id = $4 AND "deletedAt" IS NULL
            RETURNING *
        `,
      [name, description, websiteUrl, blogId]
    );

    return blog || null;
  }
}
