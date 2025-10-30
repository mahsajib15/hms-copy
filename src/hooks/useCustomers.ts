import { useOrders } from './useOrders';
// import { Customers } from '@/components/pages/store/customers/Customers';
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/apiClient";

export interface Customers {
    name: string,
    id: number,
    email: string,
    phone_number: string,
    customer_uid: string,
    created_at: string,
    total: number,
}

export interface CustomersResponse {
    customers: Customers[];
    total: number;
    totalItems: number;
    page: number;
    totalPages: number;
    limit: number;
    message: string;
    success: boolean;
}

export const useCustomers = (
    page = 1,
    limit = 8,
    searchCustomerUid = "",
    searchCustomer = "",
    sortBy = "created_at"
) => {
    const token = useAuthStore((state) => state.token);
    return useQuery<CustomersResponse, Error>({
        queryKey: ["customers", token, page, limit, sortBy],
        queryFn: async () => {
            if (!token) throw new Error("Not authenticated");
            const params = {
                page,
                limit,
                sorts: sortBy || "",
                ...apiClient(searchCustomerUid && { customer_uid: searchCustomerUid }),
                ...apiClient(searchCustomerUid && { search: searchCustomer }),
            };
            const response = await apiClient.get(
                `https://pos-api-dev.mohajon.app/api/v1/store/customers`,
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (!response.data.success) {
                throw new Error(response.data.message || "failed to fetch orders");
            }

            const totalItemsCount = response.data.pagination.totalItems;
            const calculatedTotalPages = Math.ceil(totalItemsCount / limit);
            
            return {
                ...response.data,
                totalPages: calculatedTotalPages,
                totalItems: totalItemsCount,
                total: totalItemsCount
            }
        },
        enabled: !!token,
        keepPrevious: true,
        staleTime: 30000,
        refetchOnWindowFocus: false,
    });
};