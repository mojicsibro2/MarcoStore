import { User } from './user.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
export declare enum ProductStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    finalPrice: number;
    status: ProductStatus;
    stock: number;
    category: Category;
    supplier: User;
    images: ProductImage[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
