// src/api/paymentService.ts
import axiosClient from './axiosClient';

export interface PaymentResponse {
  orderId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED';
  reference: string;
}

export const paymentService = {
  async simulatePayment(orderId: string): Promise<PaymentResponse> {
    const res = await axiosClient.post(`/payments/simulate`, { orderId });
    return res.data;
  },
};
