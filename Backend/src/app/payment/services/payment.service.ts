import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from 'src/shared/entities/order.entity';
import { Payment } from 'src/shared/entities/payment.entity';
import { EntityManager } from 'typeorm';
@Injectable()
export class PaymentService {
  async simulatePayment(
    order: Order,
    manager: EntityManager,
  ): Promise<Payment> {
    const paymentRepo = manager.getRepository(Payment);
    const orderRepo = manager.getRepository(Order);
    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payment = paymentRepo.create({
      order,
      method: 'Simulated',
      amount: order.totalAmount,
      status: 'COMPLETED',
    });

    await paymentRepo.save(payment);

    order.status = OrderStatus.PAID;
    await orderRepo.save(order);

    return payment;
  }
}
