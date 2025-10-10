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
  customer?: {
    name: string;
    phone_number: string;
  };
  created_by?: {
    id: number;
    name: string;
  };
  billingDetails?: {
    total: number;
    received: number;
    due: number;
    discountApplied: number;
    amount: number;
    receivable: number;
    paymentMethod: string;
  };
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

export const useOrders = (
  page = 1,
  limit = 8,
  searchConsignmentId = "",
  searchCustomer = "",
  sortBy = "createdAt"
) => {
  const token = useAuthStore((state) => state.token);
  return useQuery<OrdersResponse, Error>({
    queryKey: ["orders", token, page, limit, searchConsignmentId, searchCustomer, sortBy],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const params = {
        page,
        limit,
        sorts: sortBy || "", // Ensure sorts is always sent
        ...(searchConsignmentId && { consignment_id: searchConsignmentId }),
        ...(searchCustomer && { search: searchCustomer }),
      };
      console.log("sortBy (from useOrders):", sortBy);
      console.log("API Params (from useOrders):", params);
      const response = await apiClient.get(
        `https://pos-api-dev.mohajon.app/api/v1/store/orders`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response (from useOrders):", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch orders");
      }
      
      return response.data;
    },
    enabled: !!token,
  });
};