import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { Connection } from 'mongoose';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestsController {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const collections = await this.databaseConnection.listCollections();

    const promises = collections.map(collection =>
      this.databaseConnection.collection(collection.name).deleteMany({})
    );

    await Promise.all(promises);

    await this.dataSource.query(
      `
       TRUNCATE TABLE 
       "users", "user_device_sessions", "user_confirmations", "user_recovery_codes"
      `
    );

    return {
      status: 'succeeded',
    };
  }
}
