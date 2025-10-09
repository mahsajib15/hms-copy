"use client";

import React from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileModal() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <Avatar className="w-20 h-20 border-2 border-blue-600">
        <AvatarImage src={user?.avatar || ""} alt={user?.name || "Profile"} />
        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
      <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
      <div className="mt-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full cursor-pointer"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
