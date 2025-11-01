import { Repository } from 'typeorm';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
export declare class UsersService {
    private userRepository;
    private configService;
    private readonly logger;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    seedAdmin(): Promise<void>;
    create(data: Partial<User>): Promise<User>;
    findOne(id: string): Promise<User>;
    findAll(pagination: PaginationDto): Promise<{
        data: User[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findPendingUsers(pagination: PaginationDto): Promise<{
        data: User[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findByEmail(email: string): Promise<User>;
    activateUser(id: string): Promise<{
        message: string;
        user: User;
    }>;
    deactivateUser(id: string): Promise<{
        message: string;
        user: User;
    }>;
    adminCreateUser(data: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
        };
    }>;
}
