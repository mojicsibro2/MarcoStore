import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../app/users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from 'src/shared/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { name, email, password, role } = data;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new BadRequestException('Email already in use');

    if (![UserRole.CUSTOMER, UserRole.SUPPLIER].includes(role)) {
      throw new BadRequestException(
        'Only customers or suppliers can self-register',
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      name,
      email,
      password: hashed,
      role: UserRole.PENDING,
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

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.role === UserRole.PENDING)
      throw new UnauthorizedException('Your account is pending approval');

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
}
