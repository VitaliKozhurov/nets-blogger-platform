export const USER_UNIQUE_CONSTRAINTS = {
  UQ_USER_LOGIN: { field: 'login', message: 'Login already exists' },
  UQ_USER_EMAIL: { field: 'email', message: 'Email already exists' },
} as const;
