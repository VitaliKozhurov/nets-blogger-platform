import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

export const IsOptionStringParam = () => {
  return applyDecorators(IsOptional(), IsString());
};
