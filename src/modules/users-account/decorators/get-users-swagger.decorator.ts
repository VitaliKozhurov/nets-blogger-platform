import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/users/user-response.dto';
import { ApiOkResponsePaginated } from 'src/core/decorators/custom-ok-api-response.decorator';

export const GetUsersSwaggerDecorator = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve users list',
      description:
        'Fetches a paginated list of users with support for filtering, sorting, and searching. Returns users based on the provided query parameters.',
    }),
    ApiOkResponsePaginated(UserResponseDto)
  );
};
