import { Order } from 'src/shared/entities/order.entity';
import { Payment } from 'src/shared/entities/payment.entity';
import { EntityManager } from 'typeorm';
export declare class PaymentService {
    simulatePayment(order: Order, manager: EntityManager): Promise<Payment>;
}
