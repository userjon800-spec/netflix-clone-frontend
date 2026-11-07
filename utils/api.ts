import axios from "axios";
import { BASE_URL } from "./index";

// 1. Markazlashtirilgan Axios Instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: Tokenni olish
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// 2. Request Interceptor (api instance uchun)
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (api instance uchun)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthRoute =
        error.config?.url?.includes("/login") ||
        error.config?.url?.includes("/register");
      if (!isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }
    return Promise.reject(error);
  }
);

// 4. Global Axios Interceptor (to'g'ridan-to'g'ri `axios.get(`${BASE_URL}/api/...`)` chaqirilgan joylar uchun)
if (typeof window !== "undefined") {
  axios.interceptors.request.use(
    (config) => {
      if (config.url?.includes("/api/")) {
        config.withCredentials = true;
        const token = getStoredToken();
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const isAuthRoute =
          error.config?.url?.includes("/login") ||
          error.config?.url?.includes("/register");
        if (!isAuthRoute) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
