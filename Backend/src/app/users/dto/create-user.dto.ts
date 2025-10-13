import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/shared/entities/user.entity';


export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Optional role — admin can create any type of user.
   * Defaults to 'pending' if not provided.
   */
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
