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
exports.AclGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_entity_1 = require("../../../shared/entities/user.entity");
const role_decorator_1 = require("../decorators/role.decorator");
const public_decorator_1 = require("../../../shared/decorators/public.decorator");
let AclGuard = class AclGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(ctx) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user)
            throw new common_1.ForbiddenException();
        if (user.role === user_entity_1.UserRole.ADMIN)
            return true;
        const allowedRoles = this.reflector.getAllAndOverride(role_decorator_1.ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
            throw new common_1.ForbiddenException('Role not permitted');
        }
        return true;
    }
};
exports.AclGuard = AclGuard;
exports.AclGuard = AclGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AclGuard);
//# sourceMappingURL=acl.guard.js.map