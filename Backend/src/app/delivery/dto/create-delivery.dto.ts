import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'Express Delivery' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Fast delivery within 24 hours', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  fee: number;

  @ApiProperty({ example: '1-2 business days', required: false })
  @IsOptional()
  @IsString()
  estimatedTime?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
