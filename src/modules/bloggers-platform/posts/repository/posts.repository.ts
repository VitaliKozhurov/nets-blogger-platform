import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IPostRepository } from './dto/post-repository.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(postId: string): Promise<IPostRepository | null> {
    const [post]: IPostRepository[] = await this.dataSource.query(
      `
          SELECT *, b."name" as blogName
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."id" = $1 "deletedAt" IS NULL
          `,
      [postId]
    );

    return post || null;
  }
}
