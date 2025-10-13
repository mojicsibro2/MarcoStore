import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!1' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
