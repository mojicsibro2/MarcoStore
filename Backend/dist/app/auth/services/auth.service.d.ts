import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../app/users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from 'src/shared/entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            desiredRole: UserRole;
        };
    }>;
    login(data: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole.ADMIN | UserRole.EMPLOYEE | UserRole.CUSTOMER | UserRole.SUPPLIER;
        };
    }>;
}
