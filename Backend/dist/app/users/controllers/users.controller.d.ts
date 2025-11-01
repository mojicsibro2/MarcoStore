import { UsersService } from '../services/users.service';
import { UserRole } from 'src/shared/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(pagination: PaginationDto): Promise<{
        data: import("src/shared/entities/user.entity").User[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findPendingUsers(pagination: PaginationDto): Promise<{
        data: import("src/shared/entities/user.entity").User[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<import("src/shared/entities/user.entity").User>;
    activateUser(id: string): Promise<{
        message: string;
        user: import("src/shared/entities/user.entity").User;
    }>;
    deactivateUser(id: string): Promise<{
        message: string;
        user: import("src/shared/entities/user.entity").User;
    }>;
    create(dto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
        };
    }>;
}
