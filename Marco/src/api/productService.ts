// src/api/productService.ts
import axiosClient from './axiosClient';
import type { PaginatedResponse } from './categoryService';

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  finalPrice: number;
  image?: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
  createdAt: string;
  approved?: boolean;
}

export const productService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Product>> {
    const res = await axiosClient.get(`/products?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  async getById(id: string): Promise<Product> {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
  },

  async create(data: Partial<Product>): Promise<Product> {
    const res = await axiosClient.post('/products', data);
    return res.data;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const res = await axiosClient.put(`/products/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },
};
