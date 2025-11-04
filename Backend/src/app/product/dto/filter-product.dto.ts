import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductDto {
  @ApiPropertyOptional({
    example: 'mouse',
    description: 'Search by product name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'electronics',
    description: 'Filter by category name',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Minimum price filter',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'Maximum price filter',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
