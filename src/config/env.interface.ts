export enum EnvVariables {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  MONGO_DB_URL = 'MONGO_DB_URL',
  JWT_ACCESS_TOKEN_SECRET = 'JWT_ACCESS_TOKEN_SECRET',
  JWT_REFRESH_TOKEN_SECRET = 'JWT_REFRESH_TOKEN_SECRET',
  JWT_ACCESS_TOKEN_TTL = 'JWT_ACCESS_TOKEN_TTL',
  JWT_REFRESH_TOKEN_TTL = 'JWT_REFRESH_TOKEN_TTL',
  APP_EMAIL_ADDRESS = 'APP_EMAIL_ADDRESS',
  APP_EMAIL_PASSWORD = 'APP_EMAIL_PASSWORD',
  INCLUDE_TESTING_MODULE = 'INCLUDE_TESTING_MODULE',
}

export type EnvVariablesType = {
  [EnvVariables.NODE_ENV]: 'development' | 'production' | 'test' | 'staging';
  [EnvVariables.PORT]: number;
  [EnvVariables.MONGO_DB_URL]: string;
  [EnvVariables.JWT_ACCESS_TOKEN_SECRET]: string;
  [EnvVariables.JWT_REFRESH_TOKEN_SECRET]: string;
  [EnvVariables.JWT_ACCESS_TOKEN_TTL]: number | string;
  [EnvVariables.JWT_REFRESH_TOKEN_TTL]: number | string;
  [EnvVariables.APP_EMAIL_ADDRESS]: string;
  [EnvVariables.APP_EMAIL_PASSWORD]: string;
  [EnvVariables.INCLUDE_TESTING_MODULE]: string;
};
