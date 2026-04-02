import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainExceptionCode, ErrorExceptionResponseBody } from './exception.type';

import { EnvVariables, EnvVariablesType } from 'src/config/env.interface';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalHttpExceptionsFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message || 'Unknown exception occurred.';
    const jsonResponse = this.buildResponseBody(request.url, message);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(jsonResponse);
  }

  private buildResponseBody(requestUrl: string, message: string): ErrorExceptionResponseBody {
    const nodeEnv = this.configService.getOrThrow<EnvVariablesType['NODE_ENV']>(
      EnvVariables.NODE_ENV
    );

    const isProduction = nodeEnv === 'production';

    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code: DomainExceptionCode.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message,
      extensions: [],
      code: DomainExceptionCode.INTERNAL_SERVER_ERROR,
    };
  }
}
