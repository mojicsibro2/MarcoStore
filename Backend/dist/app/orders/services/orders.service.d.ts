import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Order, OrderStatus } from 'src/shared/entities/order.entity';
import { PaymentService } from 'src/app/payment/services/payment.service';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly paymentsService;
    private entityManager;
    constructor(orderRepository: Repository<Order>, paymentsService: PaymentService, entityManager: EntityManager);
    checkout(user: User, deliveryModeId: string): Promise<{
        message: string;
        order: {
            id: string;
            totalAmount: number;
            status: OrderStatus;
        };
        payment: import("../../../shared/entities/payment.entity").Payment;
    }>;
    findAll(user: User): Promise<Order[]>;
    findOne(id: string, user: User): Promise<Order>;
}
