"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/lib/authApi";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LoginInput, LoginResponse } from "../../../types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));
  const router = useRouter();
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const mutation = useMutation<LoginResponse, any, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      setCredentials({ token: data.access_token, user: data.session });
      toast.success("Login successful! Welcome back to  Mohajon");
      await delay(250);
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Invalid email/phone or password"
      );
    },
  });

  const onSubmit = (vals: LoginInput) => mutation.mutate(vals);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-balance">
                Mohajon
              </h1>
            </div>
            <p className="text-muted-foreground text-center text-balance">
              Admin Portal
            </p>
          </div>
          <Card className="border-border shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Phone</Label>
                  <Input
                    id="identifier"
                    placeholder="enter email"
                    {...register("identifier", {
                      required: "Email or phone is required",
                    })}
                    className="border-gray-300 focus:border-blue-500"
                  />
                  {errors.identifier && (
                    <p className="text-sm text-red-500">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password required",
                    })}
                    className="border-gray-300 focus:border-blue-500"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md hover:from-blue-700 hover:to-purple-800 transition-all duration-200"
                  disabled={mutation.isLoading || isSubmitting}
                >
                  {mutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  );
}
