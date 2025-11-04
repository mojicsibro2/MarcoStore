import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryMode } from '../../shared/entities/delivery-mode.entity';
import { DeliveryController } from './controllers/delivery.controller';
import { DeliveryService } from './services/delivery.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryMode])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
