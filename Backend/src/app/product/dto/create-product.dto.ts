import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Noise-cancelling Bluetooth headset',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 250.5 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'd8e1c773-48b8-4c97-9338-637c4b6ad456' })
  @IsUUID()
  categoryId: string;
}

export class PercentageDto {
  @ApiProperty({
    example: 10,
    description: 'Percentage to increase the price by',
  })
  @IsNumber()
  @Min(0)
  percentage: number;
}
