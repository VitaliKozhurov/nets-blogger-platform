// 23xxx - Integrity Constraint Violation
export const POSTGRES_INTEGRITY_ERRORS = {
  UNIQUE_VIOLATION: '23505', // Нарушение уникальности
  FOREIGN_KEY_VIOLATION: '23503', // Нарушение внешнего ключа
  NOT_NULL_VIOLATION: '23502', // Нарушение NOT NULL
  CHECK_VIOLATION: '23514', // Нарушение условия CHECK
};
