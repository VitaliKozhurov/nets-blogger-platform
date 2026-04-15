import { applyDecorators, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../guards/basic-auth/basic-auth.guard';

export const UseBasicGuard = () => {
  return applyDecorators(UseGuards(BasicAuthGuard));
};
