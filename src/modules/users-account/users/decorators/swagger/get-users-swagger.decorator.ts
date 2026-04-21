import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/core/decorators';
import { GetUsersQueryDto } from '../../api/dto';
import { UserResponseDto } from '../../api/dto';

export const GetUsersSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve users list',
      description:
        'Fetches a paginated list of users with support for filtering, sorting, and searching. Returns users based on the provided query parameters.',
    }),
    ApiQuery({ type: GetUsersQueryDto }),
    ApiOkResponsePaginated(UserResponseDto)
  );
};
