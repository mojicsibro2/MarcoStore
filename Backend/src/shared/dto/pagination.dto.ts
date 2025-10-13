// import { IsNumberString, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  // @IsOptional()
  // @IsNumberString()
  @ApiPropertyOptional({
    default: 1,
    description: 'Page number (starts from 1)',
  })
  page: number = 0;

  // @IsOptional()
  // @IsNumberString()
  @ApiPropertyOptional({ default: 10, description: 'Number of items per page' })
  pageSize: number = 0;
}
