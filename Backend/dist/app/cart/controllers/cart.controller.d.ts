import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { User } from 'src/shared/entities/user.entity';
import { UpdateCartItemDto } from '../dto/update-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: User): Promise<import("../../../shared/entities/cart.entity").Cart>;
    addToCart(user: User, dto: AddToCartDto): Promise<import("../../../shared/entities/cart.entity").Cart>;
    updateItem(user: User, itemId: string, dto: UpdateCartItemDto): Promise<import("../../../shared/entities/cart.entity").Cart>;
    removeItem(user: User, itemId: string): Promise<import("../../../shared/entities/cart.entity").Cart>;
}
