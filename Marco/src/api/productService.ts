import axiosClient from "./axiosClient";
import type { PaginatedResponse } from "./categoryService";

export interface ProductImage {
  id: string;
  imageUrl: string;
}

export type ProductStatus = "PENDING" | "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  finalPrice: number;
  stock: number;
  status: ProductStatus;
  category: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
  image: ProductImage;
  createdAt: string;
}

/**
 * ✅ Product Service — matches latest backend endpoints
 */
export const productService = {
  /** ✅ [Public] Get all active products (with filters & pagination) */
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> {
    const res = await axiosClient.get(
      `/products?page=${params?.page}&limit=${params?.limit}`
    );
    return res.data.data; // { data, meta }
  },

  async adminGetAll(params?: {
    page?: number;
    limit?: number;
    status?: ProductStatus;
  }
  ): Promise<PaginatedResponse<Product>> {
    const res = await axiosClient.get(`/products/admin?page=${params?.page}&pageSize=${params?.limit}&status=${params?.status}`);
    return res.data.data; // { data, meta }
  },

  /** ✅ [Supplier] Get all products created by the logged-in supplier */
  async getSupplierProducts(
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Product>> {
    const res = await axiosClient.get(
      `/products/my?page=${page}&pageSize=${pageSize}`
    );
    return res.data.data; // { data, meta }
  },

  /** ✅ [Admin/Employee] Get all pending products */
  async getPendingProducts(
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Product>> {
    const res = await axiosClient.get(
      `/products/pending?page=${page}&pageSize=${pageSize}`
    );
    return res.data; // { data, meta }
  },

  /** ✅ [Public] Get single product by ID */
  async getById(id: string): Promise<Product> {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data.data; // single product object
  },

  /** ✅ [Supplier] Create product with optional images */
  async create(data: FormData): Promise<Product> {
    const res = await axiosClient.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // created product
  },

  /** ✅ [Supplier/Admin] Update product */
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      stock?: number;
      basePrice?: number;
      categoryId?: string;
    }
  ): Promise<Product> {
    const res = await axiosClient.patch(`/products/${id}`, data);
    return res.data;
  },

  /** ✅ [Supplier/Admin] Delete product */
  async delete(id: string): Promise<{ message: string }> {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },

  /** ✅ [Admin/Employee] Approve product (add % profit) */
  async approve(id: string, percentage: number): Promise<Product> {
    const res = await axiosClient.patch(
      `/products/${id}/approve?percentage=${percentage}`
    );
    return res.data;
  },
  async deapprove(id: string): Promise<Product> {
    const res = await axiosClient.patch(`/products/${id}/deapprove`);
    return res.data;
  },
};
