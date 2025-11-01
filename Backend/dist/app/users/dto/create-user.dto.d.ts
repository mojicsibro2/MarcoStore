import { UserRole } from 'src/shared/entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    desiredRole?: UserRole;
}
