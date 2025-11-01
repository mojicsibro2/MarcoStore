import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { DeliveryService } from '../services/delivery.service';
export declare class DeliveryController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveryService);
    findAll(activeOnly?: boolean): Promise<import("../../../shared/entities/delivery-mode.entity").DeliveryMode[]>;
    findOne(id: string): Promise<import("../../../shared/entities/delivery-mode.entity").DeliveryMode>;
    create(dto: CreateDeliveryDto): Promise<import("../../../shared/entities/delivery-mode.entity").DeliveryMode>;
    update(id: string, dto: UpdateDeliveryDto): Promise<import("../../../shared/entities/delivery-mode.entity").DeliveryMode>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
