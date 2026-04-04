import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DomainException } from 'src/core/exceptions';
import { DomainExceptionCode, Extension } from 'src/core/exceptions/exception.type';

const transformErrors = (errors: ValidationError[]): Extension[] => {
  const responseErrors: { message: string; field: string }[] = [];

  errors.forEach(error => {
    if (error.children?.length) {
      responseErrors.push(...transformErrors(error.children));
    }

    if (error.constraints) {
      const constrainKeys = Object.keys(error.constraints);
      const constraintsObject = error.constraints;

      constrainKeys.forEach(constrainKey => {
        responseErrors.push({
          message: constraintsObject[constrainKey],
          field: error.property,
        });
      });
    } else {
      responseErrors.push({
        message: `${error.property} has incorrect value`,
        field: error.property,
      });
    }
  });

  return responseErrors;
};

export const setupPipesConfig = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // cuts out fields that are not in the dto
      forbidNonWhitelisted: true, // throws an error if fields are not in the dto
      stopAtFirstError: true, // only first error for each field
      exceptionFactory: (errors: ValidationError[]) => {
        const extensions = transformErrors(errors);

        return new DomainException({
          code: DomainExceptionCode.VALIDATION_ERROR,
          message: 'Validation error',
          extensions,
        });
      },
    })
  );
};
