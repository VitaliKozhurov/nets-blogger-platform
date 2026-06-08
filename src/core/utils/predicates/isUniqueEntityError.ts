import { QueryFailedError } from 'typeorm';

export const isUniqueEntityError = (error: unknown): boolean => {
  if (error instanceof QueryFailedError) {
    return error.driverError?.code === '23505';
  }

  return false;
};
