import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'List all users' })
  @Get('')
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @ApiOperation({ summary: 'List pending users' })
  @Get('pending')
  findPendingUsers(@Query() pagination: PaginationDto) {
    return this.usersService.findPendingUsers(pagination);
  }

  @ApiOperation({ summary: 'get user by id' })
  @Get(':id')
  findOne(@Param('id', IsValidUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Activate a pending user' })
  @Patch(':id/activate')
  activateUser(@Param('id', IsValidUUIDPipe) id: string) {
    return this.usersService.activateUser(id);
  }

  @ApiOperation({ summary: 'Deactivate a user' })
  @Patch(':id/deactivate')
  deactivateUser(@Param('id', IsValidUUIDPipe) id: string) {
    return this.usersService.deactivateUser(id);
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin create any user' })
  @Post('admin/create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.adminCreateUser(dto);
  }
}
