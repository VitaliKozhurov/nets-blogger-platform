import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: String,
  })
  login: string;

  @ApiProperty({
    type: String,
  })
  userId: string;
}
