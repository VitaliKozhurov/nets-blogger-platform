import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiErrorResponse, ApiOkResponsePaginated } from 'src/core/decorators';
import { CommentResponseDto, GetCommentsByPostIdQueryDto } from '../../api/dto';

export const GetCommentsByPostIdSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve comments by post id list',
      description:
        'Fetches a paginated list of comments. Returns comments based on the provided query parameters.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the post',
      example: '507f1f77bcf86cd799439011',
      required: true,
    }),
    ApiQuery({ type: GetCommentsByPostIdQueryDto }),
    ApiOkResponsePaginated(CommentResponseDto),
    ApiErrorResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If post for passed post ID not exist',
    })
  );
};
