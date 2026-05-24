import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostResponseMapperDto } from '../api';
import { IPostRepository } from './dto/post-with-details.dto';
import { LikeStatus } from '../../likes';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(postId: string): Promise<IPostRepository | null> {
    const [post]: IPostRepository[] = await this.dataSource.query(
      `
          SELECT *, b."name" as blogName
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."id" = $1 AND p."deletedAt" IS NULL
          `,
      [postId]
    );

    return post || null;
  }

  async create(dto: { title: string; shortDescription: string; content: string; blogId: string }) {
    const { blogId, title, shortDescription, content } = dto;

    const [post]: Omit<IPostRepository, 'likesCount' | 'dislikesCount' | 'myStatus'>[] =
      await this.dataSource.query(
        `
          INSERT INTO "posts" ("blogId", title, "shortDescription", content)
            VALUES ($1, $2, $3, $4)
            RETURNING *, (SELECT name FROM blogs WHERE id = $1) as "blogName"
        `,
        [blogId, title, shortDescription, content]
      );

    return PostResponseMapperDto.mapToView({
      post: { ...post, likesCount: 0, dislikesCount: 0, myStatus: LikeStatus.None },
      newestLikes: [],
    });
  }

  async update(dto: {
    blogId: string;
    postId: string;
    title: string;
    shortDescription: string;
    content: string;
  }) {
    const { blogId, postId, title, shortDescription, content } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "posts"
            SET "title" = $3,
                "shortDescription" = $4,
                "content" = $5
            WHERE "blogId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [blogId, postId, title, shortDescription, content]
    );

    return rows.length > 0;
  }

  async delete(dto: { blogId: string; postId: string }) {
    const { blogId, postId } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "posts"
            SET "deletedAt" = NOW()
            WHERE "blogId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [blogId, postId]
    );

    return rows.length > 0;
  }
}
