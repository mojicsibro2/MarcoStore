import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateCartItemDto } from '../dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'View active cart' })
  @Get()
  getCart(@CurrentUser() user: User) {
    return this.cartService.getActiveCart(user);
  }

  @ApiOperation({ summary: 'Add product to cart' })
  @Post('add')
  addToCart(@CurrentUser() user: User, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user, dto);
  }

  @ApiOperation({ summary: 'Update item quantity' })
  @Patch(':itemId')
  updateItem(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(user, itemId, dto);
  }

  @ApiOperation({ summary: 'Remove product from cart' })
  @Delete(':itemId')
  removeItem(@CurrentUser() user: User, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user, itemId);
  }
}
