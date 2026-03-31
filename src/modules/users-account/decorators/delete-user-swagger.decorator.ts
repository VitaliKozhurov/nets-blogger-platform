import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const DeleteUserSwaggerDecorator = () => {
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
    ApiNotFoundResponse({
      description: 'User with the specified ID was not found.',
    })
  );
};
