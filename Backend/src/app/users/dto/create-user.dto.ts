import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RegisterRole } from 'src/app/auth/dto/register.dto';
import { UserRole } from 'src/shared/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Optional role — admin can create any type of user.
   * Defaults to 'pending' if not provided.
   */
  @ApiProperty({ example: 'CUSTOMER', enum: RegisterRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /**
   * Optional intended role (used when creating a pending account).
   * Only needed if role = PENDING.
   */
  @IsOptional()
  @IsEnum(UserRole)
  desiredRole?: UserRole;
}
