import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setCredentials: (data: { token: string; user: User | null }) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setCredentials: ({ token, user }) => {
        set({ token, user });
      },
      logout: () => {
        set({ token: null, user: null });
      },
      setToken: (token) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);

export const getAuthStore = () => useAuthStore.getState();
