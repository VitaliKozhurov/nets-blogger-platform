export class Extension {
  constructor(
    public message: string,
    public field: string
  ) {}
}

export enum DomainExceptionCode {
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  EMAIL_CONFIRMATION_ERROR = 'EMAIL_CONFIRMATION_ERROR',
  CONFIRMATION_CODE_EXPIRATION_ERROR = 'CONFIRMATION_CODE_EXPIRATION_ERROR',
  PASSWORD_RECOVERY_CODE_EXPIRATION_ERROR = 'PASSWORD_RECOVERY_CODE_EXPIRATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
}

export type ErrorExceptionResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCode;
};
