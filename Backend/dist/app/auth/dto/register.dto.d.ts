import { UserRole } from 'src/shared/entities/user.entity';
export declare enum RegisterRole {
    CUSTOMER = "CUSTOMER",
    SUPPLIER = "SUPPLIER"
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}
