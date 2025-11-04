/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axiosClient";
import type { Product } from "./productService";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface PaginatedCartResponse {
  data: CartItem[];
  totalItems: number;
  totalPrice: number;
  currentPage: number;
  totalPages: number;
}

function normalizeCartResponse(apiData: any): PaginatedCartResponse {
  // Handles different shapes from /cart, /cart/:id, etc.
  if (!apiData)
    return {
      data: [],
      totalItems: 0,
      totalPrice: 0,
      currentPage: 1,
      totalPages: 1,
    };

  const items = apiData.items || apiData.data?.items || [];
  const total = parseFloat(apiData.total || apiData.data?.total || "0");

  return {
    data: items.map((item: any) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      subtotal: parseFloat(item.subtotal || "0"),
    })),
    totalItems: items.length,
    totalPrice: total,
    currentPage: 1,
    totalPages: 1,
  };
}

export const cartService = {
  async getCart(page = 1, pageSize = 10): Promise<PaginatedCartResponse> {
    const res = await axiosClient.get(
      `/cart?page=${page}&pageSize=${pageSize}`
    );
    return normalizeCartResponse(res.data.data);
  },

  async addItem(
    productId: string,
    quantity = 1
  ): Promise<PaginatedCartResponse> {
    const res = await axiosClient.post("/cart/add", { productId, quantity });
    return normalizeCartResponse(res.data.data);
  },

  async updateItem(
    itemId: string,
    quantity: number
  ): Promise<PaginatedCartResponse> {
    const res = await axiosClient.patch(`/cart/${itemId}`, { quantity });
    return normalizeCartResponse(res.data.data);
  },

  async removeItem(itemId: string): Promise<PaginatedCartResponse> {
    const res = await axiosClient.delete(`/cart/${itemId}`);
    return normalizeCartResponse(res.data.data);
  },

  async clearCart(): Promise<PaginatedCartResponse> {
    const res = await axiosClient.delete("/cart/clear");
    return normalizeCartResponse(res.data.data);
  },
};
