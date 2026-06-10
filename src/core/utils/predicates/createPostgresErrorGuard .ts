import { QueryFailedError } from 'typeorm';

export const createPostgresErrorGuard = <T extends string>(targetCode: T) => {
  return (
    error: unknown
  ): error is {
    driverError: { code: T; constraint: string; detail?: string };
  } => {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError;
      const code = driverError?.code;

      return code === targetCode && typeof driverError?.constraint === 'string';
    }

    return false;
  };
};
