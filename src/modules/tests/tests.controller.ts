import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestsController {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);

      await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
    }

    // await this.dataSource.query(
    //   `
    //    TRUNCATE TABLE
    //    "users",
    //    "user_device_sessions",
    //    "user_confirmations",
    //    "user_recovery_codes",
    //    "blogs",
    //    "posts",
    //    "comments",
    //    "post_likes",
    //    "comment_likes"
    //   `
    // );

    return {
      status: 'succeeded',
    };
  }
}
