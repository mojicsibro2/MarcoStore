import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../../shared/entities/cart.entity';
import { CartService } from './services/cart.service';
import { CartItem } from '../../shared/entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
