"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../shared/entities/user.entity");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async seedAdmin() {
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        const existing = await this.userRepository.findOne({
            where: { email: adminEmail },
        });
        if (existing) {
            this.logger.log(`Admin already exists: ${adminEmail}`);
            return;
        }
        const password = this.configService.get('ADMIN_PASSWORD');
        const hashed = await bcrypt.hash(password, 10);
        const admin = this.userRepository.create({
            name: 'Super Admin',
            email: adminEmail,
            password: hashed,
            role: user_entity_1.UserRole.ADMIN,
        });
        await this.userRepository.save(admin);
        this.logger.log(`✅ Admin user created: ${adminEmail}`);
    }
    async create(data) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
    async findOne(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findAll(pagination) {
        const page = pagination.page || 1;
        const pageSize = pagination.pageSize || 10;
        const skip = (page - 1) * pageSize;
        const [users, totalUsers] = await this.userRepository.findAndCount({
            skip,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });
        const totalPage = Math.ceil(totalUsers / pageSize);
        const currentPage = skip / pageSize + 1;
        return {
            data: users,
            meta: {
                total: totalUsers,
                currentPage,
                lastPage: totalPage,
            },
        };
    }
    async findPendingUsers(pagination) {
        const page = pagination.page || 1;
        const pageSize = pagination.pageSize || 10;
        const skip = (page - 1) * pageSize;
        const [users, totalUsers] = await this.userRepository.findAndCount({
            where: { role: user_entity_1.UserRole.PENDING },
            skip,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });
        const totalPage = Math.ceil(totalUsers / pageSize);
        const currentPage = skip / pageSize + 1;
        return {
            data: users,
            meta: {
                total: totalUsers,
                currentPage,
                lastPage: totalPage,
            },
        };
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async activateUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== user_entity_1.UserRole.PENDING) {
            throw new common_1.BadRequestException('User already active');
        }
        if (!user.desiredRole) {
            throw new common_1.BadRequestException('No desired role set for this user');
        }
        user.role = user.desiredRole;
        user.desiredRole = null;
        await this.userRepository.save(user);
        return {
            message: `User activated successfully as ${user.role}`,
            user,
        };
    }
    async deactivateUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role == user_entity_1.UserRole.PENDING) {
            throw new common_1.BadRequestException('User already in Pending');
        }
        if (user.desiredRole) {
            throw new common_1.BadRequestException('desired role set for this user');
        }
        user.desiredRole = user.role;
        user.role = user_entity_1.UserRole.PENDING;
        await this.userRepository.save(user);
        return {
            message: `User activated successfully as ${user.role}`,
            user,
        };
    }
    async adminCreateUser(data) {
        const { email, password, role } = data;
        const existingUser = await this.findByEmail(email);
        if (existingUser)
            throw new common_1.BadRequestException('Email already in use');
        if (![user_entity_1.UserRole.CUSTOMER, user_entity_1.UserRole.SUPPLIER].includes(role)) {
            throw new common_1.BadRequestException('Only customers or suppliers can self-register');
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await this.create({
            ...data,
            password: hashed,
            role: role || user_entity_1.UserRole.PENDING,
        });
        return {
            message: 'Registration successful, awaiting admin approval.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map