import { Order } from './order.entity';
export declare class Payment {
    id: string;
    order: Order;
    amount: number;
    method: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
}
