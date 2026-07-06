import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data?.message || "Something went wrong.");

    if (error.response?.status === 401) {
      window.location.href = "/";
    }

    if (error.response?.status === 403) {
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;
