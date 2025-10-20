import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../../shared/entities/cart.entity';
import { CartService } from './services/cart.service';
import { CartItem } from '../../shared/entities/cart-item.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
