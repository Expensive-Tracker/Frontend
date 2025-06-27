import { handleUserSignOut } from "@/store/slice/userSlice";
import store from "@/store/store";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (err: any) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("authToken");
      store.dispatch(handleUserSignOut());
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
