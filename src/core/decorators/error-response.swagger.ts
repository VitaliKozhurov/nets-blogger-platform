import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { DomainExceptionCode, Extension } from '../exceptions/exception.type';

type ApiErrorResponseOptions = {
  status: HttpStatus;
  description?: string;
  example?: {
    code: string;
    message: string;
    extensions?: Array<{
      field: string;
      message: string;
    }>;
  };
};

class ErrorResponseDto {
  @ApiProperty({ enum: DomainExceptionCode })
  code: string;

  @ApiProperty({
    example: 'User is not authorized',
    description: 'Human-readable error message',
  })
  message: string;

  @ApiPropertyOptional({
    type: () => [Extension],
    description: 'Additional error details',
  })
  extensions?: Extension[];
}

export function ApiErrorResponse(options: ApiErrorResponseOptions) {
  const { status, description, example } = options;

  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ErrorResponseDto) },
          {
            example,
          },
        ],
      },
    })
  );
}
