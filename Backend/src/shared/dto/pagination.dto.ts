// import { IsNumberString, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  // @IsOptional()
  // @IsNumberString()
  @ApiPropertyOptional({
    default: 1,
    description: 'Page number (starts from 1)',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 0;

  // @IsOptional()
  // @IsNumberString()
  @ApiPropertyOptional({ default: 10, description: 'Number of items per page' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number = 0;
}
