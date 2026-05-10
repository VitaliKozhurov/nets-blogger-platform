import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IBlogRepository } from './dto/IBlogRepositoryDto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(id: string) {
    const [blog]: IBlogRepository[] = await this.dataSource.query(
      `
          SELECT *
            FROM blogs
            WHERE id=$1 AND "deletedAt" IS NULL
          `,
      [id]
    );

    return blog || null;
  }
}
