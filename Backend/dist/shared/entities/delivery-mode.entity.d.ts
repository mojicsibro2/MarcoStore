import { Order } from './order.entity';
export declare class DeliveryMode {
    id: string;
    name: string;
    description: string;
    fee: number;
    estimatedTime: string;
    isActive: boolean;
    orders: Order[];
}
