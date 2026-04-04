import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/core/decorators';
import {
  GetUsersQueryParamsDocumentationDto,
  UserResponseDocumentationDto,
} from '../dto/doc/user.doc';

export const GetUsersSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve users list',
      description:
        'Fetches a paginated list of users with support for filtering, sorting, and searching. Returns users based on the provided query parameters.',
    }),
    ApiQuery({ type: GetUsersQueryParamsDocumentationDto }),
    ApiOkResponsePaginated(UserResponseDocumentationDto)
  );
};
