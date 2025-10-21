"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import Navbar from "@/components/pages/Navbar";
import Sidebar from "@/components/pages/Sidebar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Spinner } from "@/components/ui/spinner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) {
      return;
    }

    let needsRedirect = false;
    if (token && pathname === "/login") {
      router.push("/");
      needsRedirect = true;
    } else if (!token && pathname !== "/login") {
      router.push("/login");
      needsRedirect = true;
    }

    setIsRedirecting(needsRedirect);

    return () => {
      setIsRedirecting(false);
    };
  }, [token, pathname, router, _hasHydrated]);

  if (!_hasHydrated || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner fontSize="lg" />
      </div>
    );
  }

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
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 md:ml-52 md:mt-16">
          {children}
          <Toaster />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;