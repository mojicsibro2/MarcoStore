import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { DeliveryService } from '../services/delivery.service';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Delivery Modes')
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveriesService: DeliveryService) {}

  @ApiOperation({ summary: 'Get all delivery modes' })
  @Get()
  @Public()
  findAll(@Query('activeOnly') activeOnly?: boolean) {
    return this.deliveriesService.findAll(activeOnly);
  }

  @ApiOperation({ summary: 'Get delivery mode by ID' })
  @Get(':id')
  @Public()
  findOne(@Param('id', IsValidUUIDPipe) id: string) {
    return this.deliveriesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Create delivery mode' })
  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Update delivery mode' })
  @Patch(':id')
  update(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() dto: UpdateDeliveryDto,
  ) {
    return this.deliveriesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete delivery mode' })
  @Delete(':id')
  remove(@Param('id', IsValidUUIDPipe) id: string) {
    return this.deliveriesService.remove(id);
  }
}
