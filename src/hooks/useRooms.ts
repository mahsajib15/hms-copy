"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/apiClient";
export interface Room {
  id: number;
  name: string;
  status: "active" | "inactive" | string;
}
interface RoomsResponse {
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
}
export const useRooms = (page = 1, limit = 10) => {
  const token = useAuthStore((state) => state.token);
  return useQuery<RoomsResponse, Error>({
    queryKey: ["rooms", token, page, limit],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await apiClient.get(`/rooms`, {
        params: { page, limit },
      });
      console.log(response.data)
      const data = response.data;
      if (data?.rooms && Array.isArray(data.rooms)) return data;
      if (Array.isArray(data)) {
        return { rooms: data, total: data.length, page, limit };
      }
      throw new Error("Unexpected rooms response format");
    },
    enabled: !!token,
  });
};