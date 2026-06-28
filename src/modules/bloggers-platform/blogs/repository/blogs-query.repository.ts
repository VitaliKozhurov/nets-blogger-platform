import { Injectable } from '@nestjs/common';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGetBlogsParamsDto } from './dto/get-blogs.params.dto';
import { BlogEntity } from '../domain/blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(BlogEntity) private blogsRepo: Repository<BlogEntity>) {}

  async findAll(query: IGetBlogsParamsDto): Promise<{
    items: BlogEntity[];
    totalCount: number;
  }> {
    const { searchNameTerm, sortBy, sortDirection, limit, offset } = query;

    const result = await this.blogsRepo.findAndCount({
      select: {
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        createdAt: true,
        isMembership: true,
      },
      where: searchNameTerm ? { name: ILike(`%${searchNameTerm}%`) } : {},
      withDeleted: false,
      order: { [sortBy]: sortDirection },
      skip: offset,
      take: limit,
    });

    return { items: result[0], totalCount: result[1] };
  }

  async findByIdOrThrow(id: string): Promise<BlogEntity> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return blog;
  }
}
