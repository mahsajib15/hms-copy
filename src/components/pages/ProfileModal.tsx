"use client";

import React from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfileModal() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
      <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
      <div className="mt-4">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}
