import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../../shared/entities/user.entity").UserRole.ADMIN | import("../../../shared/entities/user.entity").UserRole.EMPLOYEE | import("../../../shared/entities/user.entity").UserRole.CUSTOMER | import("../../../shared/entities/user.entity").UserRole.SUPPLIER;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../../shared/entities/user.entity").UserRole;
            desiredRole: import("../../../shared/entities/user.entity").UserRole;
        };
    }>;
}
