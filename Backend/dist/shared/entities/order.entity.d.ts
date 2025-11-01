import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { DeliveryMode } from './delivery-mode.entity';
import { Payment } from './payment.entity';
export declare enum OrderStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAID = "PAID",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: string;
    customer: User;
    items: OrderItem[];
    deliveryMode: DeliveryMode;
    totalAmount: number;
    payments: Payment[];
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}
