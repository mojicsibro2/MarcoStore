import axiosClient from "./axiosClient";
import type { Product } from "./productService";

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface PaginatedCartResponse {
  data: CartItem[];
  totalItems: number;
  totalPrice: number;
  currentPage: number;
  totalPages: number;
}

export const cartService = {
  async getCart(page = 1, pageSize = 10): Promise<PaginatedCartResponse> {
    const res = await axiosClient.get(
      `/cart?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  async addItem(productId: string, quantity = 1): Promise<Cart> {
    const res = await axiosClient.post("/cart/add", { productId, quantity });
    return res.data;
  },

  async updateItem(productId: string, quantity: number): Promise<Cart> {
    const res = await axiosClient.put(`/cart/update/${productId}`, {
      quantity,
    });
    return res.data;
  },

  async removeItem(productId: string): Promise<Cart> {
    const res = await axiosClient.delete(`/cart/remove/${productId}`);
    return res.data;
  },

  async clearCart(): Promise<Cart> {
    const res = await axiosClient.delete("/cart/clear");
    return res.data;
  },
};
