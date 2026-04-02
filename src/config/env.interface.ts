export interface EnvVariables {
  MONGO_DB_URL: string;
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  PORT: number;
}
