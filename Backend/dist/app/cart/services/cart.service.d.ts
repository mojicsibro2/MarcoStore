import { Repository } from 'typeorm';
import { Cart } from 'src/shared/entities/cart.entity';
import { CartItem } from 'src/shared/entities/cart-item.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { User } from 'src/shared/entities/user.entity';
import { UpdateCartItemDto } from '../dto/update-cart.dto';
import { ProductService } from 'src/app/product/services/product.service';
export declare class CartService {
    private readonly cartRepository;
    private readonly cartItemRepository;
    private readonly productService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, productService: ProductService);
    getActiveCart(user: User): Promise<Cart>;
    addToCart(user: User, dto: AddToCartDto): Promise<Cart>;
    updateItemQuantity(user: User, itemId: string, dto: UpdateCartItemDto): Promise<Cart>;
    removeItem(user: User, itemId: string): Promise<Cart>;
    recalculateTotal(cartId: string): Promise<void>;
}
