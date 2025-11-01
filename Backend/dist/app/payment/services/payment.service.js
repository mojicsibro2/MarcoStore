"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const order_entity_1 = require("../../../shared/entities/order.entity");
const payment_entity_1 = require("../../../shared/entities/payment.entity");
let PaymentService = class PaymentService {
    async simulatePayment(order, manager) {
        const paymentRepo = manager.getRepository(payment_entity_1.Payment);
        const orderRepo = manager.getRepository(order_entity_1.Order);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const payment = paymentRepo.create({
            order,
            method: 'Simulated',
            amount: order.totalAmount,
            status: 'COMPLETED',
        });
        await paymentRepo.save(payment);
        order.status = order_entity_1.OrderStatus.PAID;
        await orderRepo.save(order);
        return payment;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=payment.service.js.map