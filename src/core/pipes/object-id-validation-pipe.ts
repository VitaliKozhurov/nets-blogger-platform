/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { DomainException, DomainExceptionCode } from '../exceptions';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: `Invalid ObjectId: ${value}`,
      });
    }

    return value;
  }
}
