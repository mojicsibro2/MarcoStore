import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Cart } from 'src/shared/entities/cart.entity';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { Product } from 'src/shared/entities/product.entity';
import { Order, OrderStatus } from 'src/shared/entities/order.entity';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { PaymentService } from 'src/app/payment/services/payment.service';
import { DeliveryMode } from 'src/shared/entities/delivery-mode.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentsService: PaymentService,
    private entityManager: EntityManager,
  ) {}

  async checkout(user: User, deliveryModeId: string) {
    return this.entityManager.transaction(async (manager) => {
      const cartRepo = manager.getRepository(Cart);
      const orderRepo = manager.getRepository(Order);
      const orderItemRepo = manager.getRepository(OrderItem);
      const productRepo = manager.getRepository(Product);
      const deliveryRepo = manager.getRepository(DeliveryMode);
      const cart = await cartRepo.findOne({
        where: { customer: { id: user.id }, checkedOut: false },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0)
        throw new BadRequestException('Cart is empty or not found');

      const deliveryMode = await deliveryRepo.findOne({
        where: { id: deliveryModeId, isActive: true },
      });
      if (!deliveryMode)
        throw new BadRequestException('Invalid delivery mode selected');

      const total = cart.items.reduce(
        (sum, item) => sum + item.product.finalPrice * item.quantity,
        0,
      );

      const totalAmount = total + Number(deliveryMode.fee || 0);

      const order = orderRepo.create({
        customer: user,
        deliveryMode,
        totalAmount,
        status: OrderStatus.PENDING_PAYMENT,
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

      // Simulated payment handled by PaymentModule
      const payment = await this.paymentsService.simulatePayment(
        savedOrder,
        manager,
      );

      // Deduct product stock
      for (const item of cart.items) {
        item.product.stock -= item.quantity;
        await productRepo.save(item.product);
      }

      // Mark cart as checked out
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

  async findAll(user: User) {
    // If Admin or Employee — get all orders (full view)
    if (user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) {
      return this.orderRepository.find({
        relations: [
          'customer',
          'items',
          'items.product',
          'items.product.supplier',
          'deliveryMode',
        ],
        order: { createdAt: 'DESC' },
      });
    }

    // If Customer — only their own orders (with supplier info)
    return this.orderRepository.find({
      where: { customer: { id: user.id } },
      relations: [
        'items',
        'items.product',
        'items.product.supplier', // ✅ Include supplier info
        'deliveryMode',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'payments'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (user.role === UserRole.CUSTOMER && order.customer.id !== user.id)
      throw new ForbiddenException();

    return order;
  }
}
