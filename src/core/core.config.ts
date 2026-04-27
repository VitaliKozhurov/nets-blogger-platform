import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from './utils';
import { EnvVariables } from './types/env.interface';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  constructor(private configService: ConfigService<unknown, true>) {
    this.port = Number(this.configService.get(EnvVariables.PORT));
    this.mongoURI = this.configService.get(EnvVariables.MONGO_DB_URL);
    this.env = this.configService.get(EnvVariables.NODE_ENV);
    this.includeTestingModule = configValidationUtility.convertToBoolean(
      this.configService.get(EnvVariables.INCLUDE_TESTING_MODULE)
    ) as boolean;

    this.postgresDB = this.configService.get(EnvVariables.POSTGRES_DB);
    this.postgresUser = this.configService.get(EnvVariables.POSTGRES_USER);
    this.postgresPassword = this.configService.get(EnvVariables.POSTGRES_PASSWORD);
    this.postgresPort = Number(this.configService.get(EnvVariables.POSTGRES_PORT));

    configValidationUtility.validateConfig(this);
  }

  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    }
  )
  port: number;

  @IsNotEmpty({
    message: `Set Env variable ${EnvVariables.MONGO_DB_URL}, example: mongodb://localhost:27017/my-app-local-db`,
  })
  mongoURI: string;

  @IsEnum(Environments, {
    message:
      'Set correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: Environments;

  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  })
  includeTestingModule: boolean;

  @IsNotEmpty({
    message: `Set Env variable ${EnvVariables.POSTGRES_DB}, example: my-postgres-db`,
  })
  postgresDB: string;

  @IsNotEmpty({
    message: `Set Env variable ${EnvVariables.POSTGRES_USER}, example: my-postgres-user`,
  })
  postgresUser: string;

  @IsNotEmpty({
    message: `Set Env variable ${EnvVariables.POSTGRES_PASSWORD}, example: my-postgres-password`,
  })
  postgresPassword: string;

  @IsNumber(
    {},
    {
      message: `Set Env variable ${EnvVariables.POSTGRES_PORT}, example: 5432`,
    }
  )
  postgresPort: number;
}
