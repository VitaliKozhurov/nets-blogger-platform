/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { DomainException, DomainExceptionCode } from '../exceptions';
import { isUUID, IsUUIDVersion } from 'class-validator';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  private version?: IsUUIDVersion ;

  static version(version: IsUUIDVersion ): UUIDValidationPipe {
    const pipe = new UUIDValidationPipe();

    pipe['version'] = version;

    return pipe;
  }

  transform(value: any, _: ArgumentMetadata) {
    const isValid = this.version ? isUUID(value, this.version) : isUUID(value);

    if (!isValid) {
      throw new DomainException({
        code: DomainExceptionCode.BAD_REQUEST_ERROR,
        message: `Invalid uuid: ${value}`,
        extensions: [{ field: 'uri param', message: 'Incorrect uri' }],
      });
    }

    return value;
  }
}
