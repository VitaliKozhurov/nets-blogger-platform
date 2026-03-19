import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './env.interface';

export type AppConfigService = ConfigService<EnvVariables>;
