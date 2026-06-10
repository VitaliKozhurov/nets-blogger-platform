import { POSTGRES_INTEGRITY_ERRORS } from 'src/core/db';
import { createPostgresErrorGuard } from './createPostgresErrorGuard ';

export const isUniqueEntityError = createPostgresErrorGuard(
  POSTGRES_INTEGRITY_ERRORS.UNIQUE_VIOLATION
);

// (
//   error: unknown
// ): error is { driverError: { code: string; constraint: string } } => {
//   if (error instanceof QueryFailedError) {
//     return (
//       error.driverError?.code &&
//       error.driverError['code'] === POSTGRES_INTEGRITY_ERRORS.UNIQUE_VIOLATION &&
//       error.driverError?.constraint &&
//       typeof error.driverError['constraint'] === 'string'
//     );
//   }

//   return false;
// };
