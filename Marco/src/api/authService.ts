import { store } from "../app/store";
import { logout } from "../auth/authSlice";
import axiosClient from "./axiosClient";


export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await axiosClient.post('/auth/login', { email, password });
    const data = res.data.data;
    return {
      access_token: data.accessToken,
      user: data.user,
    }
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await axiosClient.post('/auth/register', data);
    return res.data;
  },

  logout() {
    localStorage.removeItem('token');
    store.dispatch(logout());
  },
};
