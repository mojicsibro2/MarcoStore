import { Cart } from './cart.entity';
import { Product } from './product.entity';
export declare class CartItem {
    id: string;
    cart: Cart;
    product: Product;
    quantity: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
}
