"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/apiClient";

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled" | string;
  createdAt: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentStatus: string;
  deliveryAddress?: string;
  phoneNumber?: string;
}

interface OrdersResponse {
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export const useOrders = (page = 1, limit = 8) => {
  const token = useAuthStore((state) => state.token);
  return useQuery<OrdersResponse, Error>({
    queryKey: ["orders", token, page, limit],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await apiClient.get(
        `https://pos-api-dev.mohajon.app/api/v1/store/orders`,
        {
          params: { page, limit, sorts: "" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch orders");
      }
      
      return response.data;
    },
    enabled: !!token,
  });
};