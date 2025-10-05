"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      setCurrentTime(`${formattedTime}<br/>${formattedDate}`);
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full fixed top-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            Mohajon
          </Link>

          <div
            className="text-center text-gray-500 dark:text-gray-400 text-md font-bold ml-4"
            dangerouslySetInnerHTML={{ __html: currentTime }}
          ></div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Login Button or Profile Avatar */}
            {!token || !user ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </Link>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar className="w-10 h-10 border-2 border-blue-600">
                      <AvatarImage
                        src={user?.avatar || ""}
                        alt={user?.name || "Profile"}
                      />
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                  </DialogHeader>
                  <div className="p-4 space-y-2">
                    <p>
                      <strong>Name:</strong> {user?.name || "User"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email || "No email"}
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      className="w-full cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
