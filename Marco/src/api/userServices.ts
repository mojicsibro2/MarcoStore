import axiosClient from './axiosClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const userService = {
  async getUsers(page = 1, limit = 10, search = '') {
    const res = await axiosClient.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, search },
    });
    return res.data;
  },

  async getAllUsers(): Promise<User[]> {
    const res = await axiosClient.get('/admin/users');
    return res.data;
  },

  async deleteUser(id: string) {
    const res = await axiosClient.delete(`/users/${id}`);
    return res.data;
  },

  async updateUser(id: string, payload: Partial<User>) {
    const res = await axiosClient.patch(`/users/${id}`, payload);
    return res.data;
  },
};
