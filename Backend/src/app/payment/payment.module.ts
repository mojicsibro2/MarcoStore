import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../shared/entities/payment.entity';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { Order } from 'src/shared/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
