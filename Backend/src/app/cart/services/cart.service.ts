import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/shared/entities/cart.entity';
import { CartItem } from 'src/shared/entities/cart-item.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { User } from 'src/shared/entities/user.entity';
import { ProductStatus } from 'src/shared/entities/product.entity';
import { UpdateCartItemDto } from '../dto/update-cart.dto';
import { ProductService } from 'src/app/product/services/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
  ) {}

  async getActiveCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { customer: { id: user.id }, checkedOut: false },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ customer: user, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(user: User, dto: AddToCartDto) {
    const product = await this.productService.findOneByOption({
      id: dto.productId,
      status: ProductStatus.ACTIVE,
    });
    if (!product) throw new NotFoundException('Product not found or inactive');

    const cart = await this.getActiveCart(user);

    const item = cart.items.find((i) => i.product.id === product.id);

    if (item) {
      item.quantity += dto.quantity;
      item.subtotal = Number(
        (item.quantity * Number(product.finalPrice)).toFixed(2),
      );
      await this.cartItemRepository.save(item);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: dto.quantity,
        subtotal: Number(
          (dto.quantity * Number(product.finalPrice)).toFixed(2),
        ),
      });
      await this.cartItemRepository.save(newItem);
    }

    await this.recalculateTotal(cart.id);
    return this.getActiveCart(user);
  }

  async updateItemQuantity(user: User, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getActiveCart(user);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = dto.quantity;
    item.subtotal = Number(
      (dto.quantity * Number(item.product.finalPrice)).toFixed(2),
    );
    await this.cartItemRepository.save(item);

    await this.recalculateTotal(cart.id);
    return this.getActiveCart(user);
  }

  async removeItem(user: User, itemId: string) {
    const cart = await this.getActiveCart(user);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Item not found in cart');

    await this.cartItemRepository.remove(item);
    await this.recalculateTotal(cart.id);
    return this.getActiveCart(user);
  }

  async recalculateTotal(cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );
    cart.total = Number(total.toFixed(2));
    await this.cartRepository.save(cart);
  }
}
