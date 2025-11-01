import axios from "axios";
import { store } from "../app/store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/v1",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  // Prefer Redux token (keeps session in sync)
  const state = store.getState();
  const token = state.auth?.token || localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
