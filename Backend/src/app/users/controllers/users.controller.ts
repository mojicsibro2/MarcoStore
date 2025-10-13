import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('pending')
  findPendingUsers() {
    return this.usersService.findPendingUsers();
  }

  @Get(':id')
  findOne(@Param('id', IsValidUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/activate')
  activateUser(@Param('id', IsValidUUIDPipe) id: string) {
    return this.usersService.activateUser(id);
  }

  @Roles(UserRole.ADMIN)
  @Post('admin/create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.adminCreateUser(dto);
  }
}
