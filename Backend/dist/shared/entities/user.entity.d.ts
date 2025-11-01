import { Product } from './product.entity';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
export declare enum UserRole {
    ADMIN = "admin",
    EMPLOYEE = "employee",
    CUSTOMER = "customer",
    SUPPLIER = "supplier",
    PENDING = "pending"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    desiredRole?: UserRole | null;
    carts: Cart[];
    products: Product[];
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
