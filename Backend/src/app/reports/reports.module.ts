import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { Product } from 'src/shared/entities/product.entity';
import { User } from 'src/shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Product])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
