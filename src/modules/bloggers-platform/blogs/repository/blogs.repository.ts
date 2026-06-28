import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { IUpdateBlogParamsDto } from './dto/update-blog.params.dto';
import { BlogEntity } from '../domain/blog.entity';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(BlogEntity) private blogsRepo: Repository<BlogEntity>) {}

  async save(blog: BlogEntity) {
    return this.blogsRepo.save(blog);
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
