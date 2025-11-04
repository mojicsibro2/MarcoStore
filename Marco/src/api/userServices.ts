import axiosClient from "./axiosClient";
import type { PaginatedResponse } from "./categoryService";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const userService = {
  async getUsers(params?: {
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> {
    const res = await axiosClient.get(
      `/users?page=${params?.page}&pageSize=${params?.limit}&role=${params?.role}`
    );
    const { data, meta } = res.data.data; // extract from nested object

    return { data, meta }; //
  },

  async adminCreateUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const res = await axiosClient.post("/users/admin/create", userData);
    return res.data.data;
  },

  async getAllUsers(): Promise<User[]> {
    const res = await axiosClient.get("/admin/users");
    return res.data.data;
  },

  async activateUser(id: string) {
    const res = await axiosClient.patch(`/users/${id}/activate`);
    return res.data.data;
  },

  async deactivateUser(id: string) {
    const res = await axiosClient.patch(`/users/${id}/deactivate`);
    return res.data.data;
  },
};
