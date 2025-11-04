// src/api/orderService.ts
import axiosClient from './axiosClient';
import type { PaginatedResponse } from './categoryService';

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  user: {
    id: string;
    name: string;
  };
  items: {
    product: {
      id: string;
      name: string;
    };
    quantity: number;
    price: number;
  }[];
  createdAt: string;
}

export const orderService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Order>> {
    const res = await axiosClient.get(`/orders?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  async getById(id: string): Promise<Order> {
    const res = await axiosClient.get(`/orders/${id}`);
    return res.data;
  },


  async updateStatus(id: string, status: string): Promise<Order> {
    const res = await axiosClient.patch(`/orders/${id}/status`, { status });
    return res.data;
  },
};
