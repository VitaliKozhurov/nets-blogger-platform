import { applyDecorators, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../../guards/bearer-auth/bearer-auth.guard';

export const UseBearerGuard = () => {
  return applyDecorators(UseGuards(BearerAuthGuard));
};
