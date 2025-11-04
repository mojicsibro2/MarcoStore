// src/api/paymentService.ts
import axiosClient from "./axiosClient";

export interface PaymentResponse {
  orderId: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  reference: string;
}
export const paymentService = {
  async simulatePayment(deliveryModeId: string): Promise<PaymentResponse> {
    const res = await axiosClient.post(
      `/orders/checkout?deliveryModeId=${deliveryModeId}`
    );

    const data = res.data.data;
    const order = data.order;
    const payment = data.payment;

    return {
      orderId: order.id,
      amount: payment.amount,
      status: payment.status === "COMPLETED" ? "SUCCESS" : "FAILED",
      reference: payment.id,
    };
  },
};
