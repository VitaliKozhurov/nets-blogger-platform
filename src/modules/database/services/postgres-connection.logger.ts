import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresConnectionLogger implements OnApplicationBootstrap {
  private readonly logger = new Logger('Postgres DB');

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ PostgreSQL database connected successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`❌ PostgreSQL database connection check failed: ${message}`);
    }
  }
}
