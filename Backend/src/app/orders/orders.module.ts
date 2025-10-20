import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../shared/entities/order.entity';
import { OrderItem } from '../../shared/entities/order-item.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { Cart } from 'src/shared/entities/cart.entity';
import { Product } from 'src/shared/entities/product.entity';
import { DeliveryMode } from 'src/shared/entities/delivery-mode.entity';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, Product, DeliveryMode]),
    PaymentModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
