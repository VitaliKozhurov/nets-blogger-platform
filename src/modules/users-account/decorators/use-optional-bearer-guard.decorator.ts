import { applyDecorators, UseGuards } from '@nestjs/common';
import { OptionalBearerAuthGuard } from '../guards/bearer-auth/optional-bearer-auth.guard';

export const UseOptionalBearerGuard = () => {
  return applyDecorators(UseGuards(OptionalBearerAuthGuard));
};
