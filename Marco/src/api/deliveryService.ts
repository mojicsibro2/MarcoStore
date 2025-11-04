// src/api/deliveryService.ts
import axiosClient from "./axiosClient";

export interface Delivery {
  id: string;
  name: string;
  description: string;
  fee: number;
  estimatedTime: string;
  isActive: boolean;
}

export const deliveryService = {
   async create(data: Omit<Delivery, "id" | "createdAt">) {
    const res = await axiosClient.post("/deliveries", data);
    return res.data;
  },
  async getAll(activeOnly = true): Promise<Delivery[]> {
    const res = await axiosClient.get(`/deliveries?activeOnly=${activeOnly}`);
    // Assuming backend returns { status, code, message, data: Delivery[] }
    return res.data.data;
  },

  async update(id: string, data: Partial<Delivery>): Promise<Delivery> {
    const res = await axiosClient.patch(`/deliveries/${id}`, data );
    return res.data;
  },
  async delete(id: string) {
    const res = await axiosClient.delete(`/deliveries/${id}`);
    return res.data;
  },
};
