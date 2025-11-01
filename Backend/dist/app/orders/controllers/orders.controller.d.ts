import { OrdersService } from '../services/orders.service';
import { User } from 'src/shared/entities/user.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(user: User, deliveryModeId: string): Promise<{
        message: string;
        order: {
            id: string;
            totalAmount: number;
            status: import("../../../shared/entities/order.entity").OrderStatus;
        };
        payment: import("../../../shared/entities/payment.entity").Payment;
    }>;
    findAll(user: User): Promise<import("../../../shared/entities/order.entity").Order[]>;
    findOne(id: string, user: User): Promise<import("../../../shared/entities/order.entity").Order>;
}
