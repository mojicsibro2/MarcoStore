// src/api/reportService.ts
import axiosClient from './axiosClient';

export const reportService = {
  async getTotalProfit() {
    const res = await axiosClient.get('/reports/total-profit');
    return res.data;
  },

  async getMonthlyReport(year: number, month: number, page = 1, pageSize = 10) {
    const res = await axiosClient.get(
      `/reports/monthly?year=${year}&month=${month}&page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  async getTopSellingProducts(page = 1, pageSize = 10) {
    const res = await axiosClient.get(`/reports/top-selling?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  async getBestSuppliers(page = 1, pageSize = 10) {
    const res = await axiosClient.get(`/reports/best-suppliers?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  async getSupplierMonthlyEarnings(supplierId: string, year: number, page = 1, pageSize = 12) {
    const res = await axiosClient.get(
      `/reports/supplier-earnings/${supplierId}?year=${year}&page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },
};
