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
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new ForbiddenException('User not found in request');

    // 1️⃣ Allow ADMIN full access
    if (user.role === UserRole.ADMIN) return true;

    // 2️⃣ Check roles metadata safely
    const allowedRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || [];

    // 3️⃣ If there are roles defined and user isn’t included
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Role not permitted');
    }

    return true;
  }
}
