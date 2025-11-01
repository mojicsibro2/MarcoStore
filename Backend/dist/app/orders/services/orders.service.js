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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../../../shared/entities/cart.entity");
const user_entity_1 = require("../../../shared/entities/user.entity");
const product_entity_1 = require("../../../shared/entities/product.entity");
const order_entity_1 = require("../../../shared/entities/order.entity");
const order_item_entity_1 = require("../../../shared/entities/order-item.entity");
const payment_service_1 = require("../../payment/services/payment.service");
const delivery_mode_entity_1 = require("../../../shared/entities/delivery-mode.entity");
let OrdersService = class OrdersService {
    constructor(orderRepository, paymentsService, entityManager) {
        this.orderRepository = orderRepository;
        this.paymentsService = paymentsService;
        this.entityManager = entityManager;
    }
    async checkout(user, deliveryModeId) {
        return this.entityManager.transaction(async (manager) => {
            const cartRepo = manager.getRepository(cart_entity_1.Cart);
            const orderRepo = manager.getRepository(order_entity_1.Order);
            const orderItemRepo = manager.getRepository(order_item_entity_1.OrderItem);
            const productRepo = manager.getRepository(product_entity_1.Product);
            const deliveryRepo = manager.getRepository(delivery_mode_entity_1.DeliveryMode);
            const cart = await cartRepo.findOne({
                where: { customer: { id: user.id }, checkedOut: false },
                relations: ['items', 'items.product'],
            });
            if (!cart || cart.items.length === 0)
                throw new common_1.BadRequestException('Cart is empty or not found');
            const deliveryMode = await deliveryRepo.findOne({
                where: { id: deliveryModeId, isActive: true },
            });
            if (!deliveryMode)
                throw new common_1.BadRequestException('Invalid delivery mode selected');
            const total = cart.items.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0);
            const totalAmount = total + Number(deliveryMode.fee || 0);
            const order = orderRepo.create({
                customer: user,
                deliveryMode,
                totalAmount,
                status: order_entity_1.OrderStatus.PENDING_PAYMENT,
            });
            const savedOrder = await orderRepo.save(order);
            for (const item of cart.items) {
                await orderItemRepo.save({
                    order: savedOrder,
                    product: item.product,
                    quantity: item.quantity,
                    price: item.product.finalPrice,
                    subtotal: item.product.finalPrice * item.quantity,
                });
            }
            const payment = await this.paymentsService.simulatePayment(savedOrder, manager);
            for (const item of cart.items) {
                item.product.stock -= item.quantity;
                await productRepo.save(item.product);
            }
            cart.checkedOut = true;
            await cartRepo.save(cart);
            return {
                message: 'Payment simulated successfully, order placed!',
                order: {
                    id: savedOrder.id,
                    totalAmount: savedOrder.totalAmount,
                    status: savedOrder.status,
                },
                payment,
            };
        });
    }
    async findAll(user) {
        if (user.role === user_entity_1.UserRole.ADMIN || user.role === user_entity_1.UserRole.EMPLOYEE) {
            return this.orderRepository.find({ relations: ['customer', 'items'] });
        }
        return this.orderRepository.find({
            where: { customer: { id: user.id } },
            relations: ['items', 'items.product'],
        });
    }
    async findOne(id, user) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'payments'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (user.role === user_entity_1.UserRole.CUSTOMER && order.customer.id !== user.id)
            throw new common_1.ForbiddenException();
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        payment_service_1.PaymentService,
        typeorm_2.EntityManager])
], OrdersService);
//# sourceMappingURL=orders.service.js.map