import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/core/decorators';

export const DeleteUserSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user',
      description: 'Permanently deletes a user account by ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the user to delete',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'User successfully deleted. No content returned.',
    }),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User with the specified ID was not found.',
    })
  );
};
