import { applyDecorators, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../../guards/bearer-auth';

export const UseBearerGuard = () => {
  return applyDecorators(UseGuards(BearerAuthGuard));
};
