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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../../app/users/services/users.service");
const user_entity_1 = require("../../../shared/entities/user.entity");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(data) {
        const { name, email, password, role } = data;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser)
            throw new common_1.BadRequestException('Email already in use');
        if (![user_entity_1.UserRole.CUSTOMER, user_entity_1.UserRole.SUPPLIER].includes(role)) {
            throw new common_1.BadRequestException('Only customers or suppliers can self-register');
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.create({
            name,
            email,
            password: hashed,
            role: user_entity_1.UserRole.PENDING,
            desiredRole: role,
        });
        return {
            message: 'Registration successful, awaiting admin approval.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                desiredRole: newUser.desiredRole,
            },
        };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.role === user_entity_1.UserRole.PENDING)
            throw new common_1.UnauthorizedException('Your account is pending approval');
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        return {
            message: 'Login successful',
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map