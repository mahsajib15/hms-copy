"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import Navbar from "@/components/pages/Navbar";
import Sidebar from "@/components/pages/Sidebar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (token && pathname === "/login") {
      router.push("/rooms"); // Redirect to main app if logged in and on login page
    } else if (!token && pathname !== "/login") {
      router.push("/login"); // Redirect to login if not logged in and not on login page
    }
  }, [token, pathname, router]);

  if (pathname === "/login") {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 md:ml-64 md:mt-16">
          {children}
          <Toaster />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;