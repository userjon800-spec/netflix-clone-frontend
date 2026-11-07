import axios from "axios";
import { BASE_URL } from "./index";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Kutilmagan xatolik yuz berdi";

    // 401 Unauthorized va boshqa xatolar uchun konsolga yozish
    console.error(`[API Xatosi] ${error.config?.url}:`, message);

    return Promise.reject(error);
  },
);

export default api;
