"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/apiClient";

export interface Order {
  id: number;
  order_uid: string;
  consignment_id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  total_price: number;
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
    phone_number: string;
  };
  table?: {
    name: string;
    number: number;
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

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
  success: boolean;
}

export const useOrders = (
  page = 1,
  limit = 8,
  searchOrderUid = "",
  searchCustomer = "",
  sortBy = "created_at"
) => {
  const token = useAuthStore((state) => state.token);
  return useQuery<OrdersResponse, Error>({
    queryKey: ["orders", token, page, limit, searchOrderUid, searchCustomer, sortBy],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const params = {
        page,
        limit,
        sorts: sortBy || "",
        ...(searchOrderUid && { order_uid: searchOrderUid }),
        ...(searchCustomer && { search: searchCustomer }),
      };
      const response = await apiClient.get(
        `https://pos-api-dev.mohajon.app/api/v1/store/orders`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Request Params:", params);
      console.log("API Response Data:", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch orders");
      }
      
      return response.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};