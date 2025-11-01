import { Repository } from 'typeorm';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { DeliveryMode } from 'src/shared/entities/delivery-mode.entity';
export declare class DeliveryService {
    private readonly deliveryRepo;
    constructor(deliveryRepo: Repository<DeliveryMode>);
    create(dto: CreateDeliveryDto): Promise<DeliveryMode>;
    findAll(activeOnly?: boolean): Promise<DeliveryMode[]>;
    findOne(id: string): Promise<DeliveryMode>;
    update(id: string, dto: UpdateDeliveryDto): Promise<DeliveryMode>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
