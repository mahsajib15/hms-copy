"use client";

import { useOrders } from './useOrders';
// import { Customers } from '@/components/pages/store/customers/Customers';


import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/apiClient";

export interface Customer {
    name: string,
    id: number,
    email: string,
    phone_number: string,
    uid: string,
    created_at: string,
}

export interface CustomersResponse {
    customers: Customer[];
    pagination: {
        total: number;
        totalItems: number;
        page: number;
        totalPages: number;
        limit: number;
    };
    message: string;
    success: boolean;
}

export const useCustomers = ({
    page = 1,
    limit = 8,
    search,
    sort = "created_at",
    order = "asc",
}: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
}) => {
    const token = useAuthStore((state) => state.token);
    return useQuery<CustomersResponse, Error>({
        queryKey: ["customers", token, page, limit, search, sort, order],
        queryFn: async () => {
            if (!token) throw new Error("Not authenticated");
            const params: { [key: string]: any } = {
                page,
                limit,
                sorts: sort,
                order,
            };

            if (search) {
                params.search = search;
            }

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
                throw new Error(response.data.message || "failed to fetch customers");
            }

            const totalItemsCount = response.data.pagination.totalItems;
            const calculatedTotalPages = response.data.pagination.totalPages;
            
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