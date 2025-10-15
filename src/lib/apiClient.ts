import axios from "axios";
import { getAuthStore } from "@/lib/store";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: `/api/v1`,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getAuthStore().token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/auth/refresh")) {
        getAuthStore().logout();
        toast.warning("Unauthorized Request or Session Expired", {
          description:
            "Your session has expired. Please log in again to continue.",
          position: "bottom-right",
        });
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.get("/auth/refresh");
        if (refreshResponse.status === 200) {
          getAuthStore().setToken(refreshResponse.data.access_token);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
