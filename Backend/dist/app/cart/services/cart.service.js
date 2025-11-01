"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../../../shared/entities/cart.entity");
const cart_item_entity_1 = require("../../../shared/entities/cart-item.entity");
const product_entity_1 = require("../../../shared/entities/product.entity");
const product_service_1 = require("../../product/services/product.service");
let CartService = class CartService {
    constructor(cartRepository, cartItemRepository, productService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }
    async getActiveCart(user) {
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
    async addToCart(user, dto) {
        const product = await this.productService.findOneByOption({
            id: dto.productId,
            status: product_entity_1.ProductStatus.ACTIVE,
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found or inactive');
        const cart = await this.getActiveCart(user);
        const item = cart.items.find((i) => i.product.id === product.id);
        if (item) {
            item.quantity += dto.quantity;
            item.subtotal = Number((item.quantity * Number(product.finalPrice)).toFixed(2));
            await this.cartItemRepository.save(item);
        }
        else {
            const newItem = this.cartItemRepository.create({
                cart,
                product,
                quantity: dto.quantity,
                subtotal: Number((dto.quantity * Number(product.finalPrice)).toFixed(2)),
            });
            await this.cartItemRepository.save(newItem);
        }
        await this.recalculateTotal(cart.id);
        return this.getActiveCart(user);
    }
    async updateItemQuantity(user, itemId, dto) {
        const cart = await this.getActiveCart(user);
        const item = cart.items.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        item.quantity = dto.quantity;
        item.subtotal = Number((dto.quantity * Number(item.product.finalPrice)).toFixed(2));
        await this.cartItemRepository.save(item);
        await this.recalculateTotal(cart.id);
        return this.getActiveCart(user);
    }
    async removeItem(user, itemId) {
        const cart = await this.getActiveCart(user);
        const item = cart.items.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item not found in cart');
        await this.cartItemRepository.remove(item);
        await this.recalculateTotal(cart.id);
        return this.getActiveCart(user);
    }
    async recalculateTotal(cartId) {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items'],
        });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const total = cart.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
        cart.total = Number(total.toFixed(2));
        await this.cartRepository.save(cart);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        product_service_1.ProductService])
], CartService);
//# sourceMappingURL=cart.service.js.map