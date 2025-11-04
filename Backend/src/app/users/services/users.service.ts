import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const existing = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existing) {
      this.logger.log(`Admin already exists: ${adminEmail}`);
      return;
    }

    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const hashed = await bcrypt.hash(password, 10);

    const admin = this.userRepository.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashed,
      role: UserRole.ADMIN,
    });

    await this.userRepository.save(admin);
    this.logger.log(`✅ Admin user created: ${adminEmail}`);
  }

  async create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(pagination: PaginationDto, role?: UserRole) {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 4;
    const skip = (page - 1) * pageSize;

    const where = role ? { role } : {};

    const [users, totalUsers] = await this.userRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'role', 'desiredRole', 'createdAt'],
    });

    return {
      data: users,
      meta: {
        total: totalUsers,
        currentPage: page,
        lastPage: Math.ceil(totalUsers / pageSize),
      },
    };
  }

  async findPendingUsers(pagination: PaginationDto) {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const [users, totalUsers] = await this.userRepository.findAndCount({
      where: { role: UserRole.PENDING },
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

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async activateUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role !== UserRole.PENDING) {
      throw new BadRequestException('User already active');
    }

    if (!user.desiredRole) {
      throw new BadRequestException('No desired role set for this user');
    }

    user.role = user.desiredRole;
    user.desiredRole = null; // clear after activation
    await this.userRepository.save(user);

    return {
      message: `User activated successfully as ${user.role}`,
      user,
    };
  }

  async deactivateUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role == UserRole.PENDING) {
      throw new BadRequestException('User already in Pending');
    }

    if (user.desiredRole) {
      throw new BadRequestException('desired role set for this user');
    }

    user.desiredRole = user.role;
    user.role = UserRole.PENDING; // clear after activation
    await this.userRepository.save(user);

    return {
      message: `User activated successfully as ${user.role}`,
      user,
    };
  }

  async adminCreateUser(data: CreateUserDto) {
    const { email, password, role } = data;

    const existingUser = await this.findByEmail(email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await this.create({
      ...data,
      password: hashed,
      role: role || UserRole.CUSTOMER, // or default role if none specified
    });

    return {
      message: 'User created successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}
