import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: string;
    customer: User;
    items: CartItem[];
    total: number;
    checkedOut: boolean;
    createdAt: Date;
    updatedAt: Date;
}
