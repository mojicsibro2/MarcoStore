import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Checkout and simulate payment' })
  @Post('checkout')
  checkout(
    @CurrentUser() user: User,
    @Query('deliveryModeId', ParseUUIDPipe) deliveryModeId: string,
  ) {
    return this.ordersService.checkout(user, deliveryModeId);
  }

  @ApiOperation({ summary: 'List all orders (admin or user)' })
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user);
  }
}
