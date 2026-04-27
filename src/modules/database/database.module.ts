import { Module } from '@nestjs/common';
import { getDatabaseProviders } from './services/data-base.providers';
import { PostgresConnectionLogger } from './services/postgres-connection.logger';

@Module({
  imports: [...getDatabaseProviders()],
  providers: [PostgresConnectionLogger],
})
export class DataBaseModule {}
