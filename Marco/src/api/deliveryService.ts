// src/api/deliveryService.ts
import axiosClient from './axiosClient';
import type { PaginatedResponse } from './categoryService';

export interface Delivery {
  id: string;
  orderId: string;
  mode: 'PICKUP' | 'DOOR' | 'DISPATCH';
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  createdAt: string;
}

export const deliveryService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Delivery>> {
    const res = await axiosClient.get(`/delivery?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<Delivery> {
    const res = await axiosClient.patch(`/delivery/${id}/status`, { status });
    return res.data;
  },
};
