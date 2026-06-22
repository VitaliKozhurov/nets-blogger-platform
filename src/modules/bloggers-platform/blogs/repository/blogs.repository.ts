import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICreateBlogParamsDto } from './dto/create-blog.params.dto';
import { IUpdateBlogParamsDto } from './dto/update-blog.params.dto';
import { BlogEntity } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

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

  async create(dto: ICreateBlogParamsDto): Promise<BlogEntity> {
    const { name, description, websiteUrl } = dto;

    const [blog]: BlogEntity[] = await this.dataSource.query(
      `
          INSERT INTO blogs (name, description, "websiteUrl")
            VALUES ($1, $2, $3)
            RETURNING *
        `,
      [name, description, websiteUrl]
    );

    return blog;
  }

  async update(dto: IUpdateBlogParamsDto): Promise<boolean> {
    const { blogId, name, description, websiteUrl } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE blogs
            SET name = $1,
                description = $2,
                "websiteUrl" = $3
            WHERE blogs.id = $4 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [name, description, websiteUrl, blogId]
    );

    return rows.length > 0;
  }

  async softDelete(blogId: string) {
    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE blogs
            SET "deletedAt" = NOW()
            WHERE blogs.id = $1 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [blogId]
    );

    return rows.length > 0;
  }
}
