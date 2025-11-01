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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const is_valid_uuid_pipe_1 = require("../../../shared/pipes/is-valid-uuid.pipe");
const role_decorator_1 = require("../../auth/decorators/role.decorator");
const user_entity_1 = require("../../../shared/entities/user.entity");
const create_user_dto_1 = require("../dto/create-user.dto");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(pagination) {
        return this.usersService.findAll(pagination);
    }
    findPendingUsers(pagination) {
        return this.usersService.findPendingUsers(pagination);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    activateUser(id) {
        return this.usersService.activateUser(id);
    }
    deactivateUser(id) {
        return this.usersService.deactivateUser(id);
    }
    create(dto) {
        return this.usersService.adminCreateUser(dto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all users' }),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List pending users' }),
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findPendingUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'get user by id' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Activate a pending user' }),
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "activateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a user' }),
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivateUser", null);
__decorate([
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin create any user' }),
    (0, common_1.Post)('admin/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.EMPLOYEE),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map