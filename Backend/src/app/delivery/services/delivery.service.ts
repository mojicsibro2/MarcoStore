import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { DeliveryMode } from 'src/shared/entities/delivery-mode.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryMode)
    private readonly deliveryRepo: Repository<DeliveryMode>,
  ) {}

  async create(dto: CreateDeliveryDto) {
    const delivery = this.deliveryRepo.create(dto);
    return this.deliveryRepo.save(delivery);
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.deliveryRepo.find({ where, order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const delivery = await this.deliveryRepo.findOne({ where: { id } });
    if (!delivery) throw new NotFoundException('Delivery mode not found');
    return delivery;
  }

  async update(id: string, dto: UpdateDeliveryDto) {
    const delivery = await this.findOne(id);
    Object.assign(delivery, dto);
    return this.deliveryRepo.save(delivery);
  }

  async remove(id: string) {
    const delivery = await this.findOne(id);
    await this.deliveryRepo.remove(delivery);
    return { message: 'Delivery mode removed successfully' };
  }
}
