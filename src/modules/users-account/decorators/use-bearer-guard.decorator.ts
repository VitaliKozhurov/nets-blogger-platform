import { applyDecorators, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../guards';

export const UseBearerGuard = () => {
  return applyDecorators(UseGuards(BearerAuthGuard));
};
