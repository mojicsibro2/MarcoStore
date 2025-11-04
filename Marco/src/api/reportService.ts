// src/api/reportService.ts
import axiosClient from './axiosClient';

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
}

export interface BestSupplier {
  id: string;
  name: string;
  totalRevenue: number;
  totalProfit: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface SupplierEarnings {
  totalEarnings: number;
  totalOrders: number;
  startDate?: string;
  endDate?: string;
}

export interface MonthlyEarning {
  month: string;
  totalEarnings: number;
  totalOrders: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
  };
}

interface Overview {
  totalUsers: number;
  pendingUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  deliveredOrders: number;
}

export const reportService = {
  async getOverview(): Promise<Overview>{
    const res = await axiosClient.get("/reports/overview");
    return res.data.data;
  },

  async getTotal(): Promise<{ totalRevenue: number; totalProfit: number }> {
    const res = await axiosClient.get("/reports/total");
    return res.data.data;
  },

  async getTopProducts(page = 1, pageSize = 10) {
    const res = await axiosClient.get(
      `/reports/top-products?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  async getBestSuppliers(page = 1, pageSize = 10) {
    const res = await axiosClient.get(
      `/reports/best-suppliers?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  async getMonthly(year: number, month: number, page = 1, pageNumber = 10){
    const res = await axiosClient.get(
      `/reports/monthly?year=${year}&month=${month}&page=${page}&pageSize=${pageNumber}`
    );
    return res.data;
  },

  async getSupplierEarnings(
    start?: string,
    end?: string
  ): Promise<SupplierEarnings> {
    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    const res = await axiosClient.get(
      `/reports/suppliers/earnings?${params.toString()}`
    );
    return res.data.data;
  },

  async getSupplierMonthlyEarnings(
    year: number,
    page = 1,
    pageSize = 6
  ): Promise<PaginatedResponse<MonthlyEarning>> {
    const res = await axiosClient.get(
      `/reports/suppliers/earnings/monthly?year=${year}&page=${page}&pageSize=${pageSize}`
    );
    return res.data.data;
  },
};
