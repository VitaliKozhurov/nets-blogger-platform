export type EnvVariablesType = {
  MONGO_DB_URL: string;
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  PORT: number;
};

export enum EnvVariables {
  MONGO_DB_URL = 'MONGO_DB_URL',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
}
