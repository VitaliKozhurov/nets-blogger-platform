export type EnvVariablesType = {
  MONGO_DB_URL: string;
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  PORT: number;
  JWT_ACCESS_TOKEN_TTL: number;
  JWT_ACCESS_TOKEN_SECRET: string;
  APP_EMAIL_ADDRESS: string;
  APP_EMAIL_PASSWORD: string;
};

export enum EnvVariables {
  MONGO_DB_URL = 'MONGO_DB_URL',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  JWT_ACCESS_TOKEN_TTL = 'JWT_ACCESS_TOKEN_TTL',
  JWT_ACCESS_TOKEN_SECRET = 'JWT_ACCESS_TOKEN_SECRET',
  APP_EMAIL_ADDRESS = 'APP_EMAIL_ADDRESS',
  APP_EMAIL_PASSWORD = 'APP_EMAIL_PASSWORD',
}
