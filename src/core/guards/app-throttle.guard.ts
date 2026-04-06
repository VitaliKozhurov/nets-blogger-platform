import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  ThrottlerGuard,
  type ThrottlerModuleOptions,
  ThrottlerRequest,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { DomainException, DomainExceptionCode } from '../exceptions';
import { Reflector } from '@nestjs/core';

export const APP_THROTTLE_META_KEY = 'app_throttle';

@Injectable()
export class AppThrottleGuard extends ThrottlerGuard {
  constructor(
    protected readonly options: ThrottlerModuleOptions,
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector
  ) {
    super(options, storageService, reflector);
  }

  protected async throwThrottlingException(_: ExecutionContext): Promise<void> {
    throw new DomainException({
      code: DomainExceptionCode.TOO_MANY_REQUESTS,
      message: 'Too many requests',
    });
  }

  protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const customConfig = this.reflector.getAllAndOverride(APP_THROTTLE_META_KEY, [
      requestProps.context.getHandler(),
      requestProps.context.getClass(),
    ]);

    if (customConfig) {
      return super.handleRequest({
        ...requestProps,
        limit: customConfig.limit,
        ttl: customConfig.ttl,
      });
    }

    return super.handleRequest(requestProps);
  }
}
