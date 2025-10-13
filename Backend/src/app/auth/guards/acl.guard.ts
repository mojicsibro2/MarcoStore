// src/auth/acl.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { ROLES_KEY } from '../decorators/role.decorator';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User; // assumed set by your JwtAuthGuard

    if (!user) throw new ForbiddenException();

    // 1) If super_admin, allow everything
    if (user.role === UserRole.ADMIN) return true;

    // 2) Check Roles metadata
    const allowedRoles =
      this.reflector.get<UserRole[]>(ROLES_KEY, ctx.getHandler()) || [];
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Role not permitted');
    }

    return true;
  }
}
