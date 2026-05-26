import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IPostEntityDto } from '../domain/dto';
import { ICreatePostParamsDto } from './dto/create-post.params.dto';
import { IUpdatePostParamsDto } from './dto/update-post.params.dto';
import { IDeletePostParamsDto } from './dto/delete-post.params.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(postId: string): Promise<(IPostEntityDto & { blogName: string }) | null> {
    const [post]: (IPostEntityDto & { blogName: string })[] = await this.dataSource.query(
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

  async create(dto: ICreatePostParamsDto): Promise<IPostEntityDto & { blogName: string }> {
    const { blogId, title, shortDescription, content } = dto;

    const [post]: (IPostEntityDto & { blogName: string })[] = await this.dataSource.query(
      `
          INSERT INTO "posts" ("blogId", title, "shortDescription", content)
            VALUES ($1, $2, $3, $4)
            RETURNING *, (SELECT name FROM blogs WHERE id = $1) as "blogName"
        `,
      [blogId, title, shortDescription, content]
    );

    return post;
  }

  async update(dto: IUpdatePostParamsDto) {
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

  async delete(dto: IDeletePostParamsDto) {
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
