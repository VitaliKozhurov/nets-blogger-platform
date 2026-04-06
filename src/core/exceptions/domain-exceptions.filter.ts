import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { DomainException } from './domain-exception';
import { Request, Response } from 'express';
import { DomainExceptionCode } from './exception.type';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.mapToHttpStatusCode(exception.code);
    const jsonResponse = this.buildExceptionResponse(exception, request.url);

    response.status(status).json(jsonResponse);
  }

  private mapToHttpStatusCode(code: DomainExceptionCode) {
    switch (code) {
      case DomainExceptionCode.BAD_REQUEST_ERROR:
      case DomainExceptionCode.VALIDATION_ERROR:
      case DomainExceptionCode.CONFIRMATION_CODE_EXPIRATION_ERROR:
      case DomainExceptionCode.EMAIL_CONFIRMATION_ERROR:
      case DomainExceptionCode.PASSWORD_RECOVERY_CODE_EXPIRATION_ERROR:
        return HttpStatus.BAD_REQUEST;

      case DomainExceptionCode.FORBIDDEN_ERROR:
        return HttpStatus.FORBIDDEN;

      case DomainExceptionCode.NOT_FOUND_ERROR:
        return HttpStatus.NOT_FOUND;

      case DomainExceptionCode.UNAUTHORIZED_ERROR:
        return HttpStatus.UNAUTHORIZED;

      case DomainExceptionCode.TOO_MANY_REQUESTS:
        return HttpStatus.TOO_MANY_REQUESTS;

      case DomainExceptionCode.INTERNAL_SERVER_ERROR:
        return HttpStatus.INTERNAL_SERVER_ERROR;

      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  private buildExceptionResponse(exception: DomainException, requestUrl: string) {
    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }
}
