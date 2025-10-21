"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/apiClient";

export interface Product {
  id: number;
  name: string;
  image: string;
  unit_price: number;
  unit_selling_price: number;
  quantity: number;
  quantity_left: number;
}

export interface Inventory {
  id: number;
  batch_id: string | null;
  inventory_uid: string;
  unit_title: string;
  unit_size: string | null;
  product: Product;
}

export interface InventoriesResponse {
  inventories: Inventory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
  success: boolean;
}

export const useInventories = (page = 1, limit = 10, product_type = "all") => {
  const token = useAuthStore((state) => state.token);
  return useQuery<InventoriesResponse, Error>({
    queryKey: ["inventories", token, page, limit, product_type],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const params = {
        page,
        limit,
        product_type,
      };
      const response = await apiClient.get(
        `https://pos-api-dev.mohajon.app/api/v1/store/inventories`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch inventories");
      }

      return response.data;
    },
    enabled: !!token,
  });
};