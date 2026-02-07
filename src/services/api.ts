import axios from "axios";
import { getToken, clearAuth } from "../utils/storage";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuth();
      // optional: redirect handled by guards (user will be kicked to login)
    }
    return Promise.reject(err);
  },
);
