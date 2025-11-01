// src/api/categoryService.ts
import axiosClient from './axiosClient';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
  };
}

export const categoryService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Category>> {
    const res = await axiosClient.get(`/categories?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  async getById(id: string): Promise<Category> {
    const res = await axiosClient.get(`/categories/${id}`);
    return res.data;
  },

  async create(data: { name: string; description?: string }): Promise<Category> {
    const res = await axiosClient.post('/categories', data);
    return res.data;
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const res = await axiosClient.put(`/categories/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await axiosClient.delete(`/categories/${id}`);
    return res.data;
  },
};
