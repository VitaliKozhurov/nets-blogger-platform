import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export const QueryIsNumber = () => {
  return applyDecorators(
    Type(() => Number),
    IsNumber()
  );
};
