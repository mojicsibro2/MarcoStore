import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
