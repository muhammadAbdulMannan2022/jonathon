"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/auth-service";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const res = await authApi.login(values);
      if (res.success) {
        toast.success("Login successful!");
        // Store tokens
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Set cookie for middleware protection
        document.cookie = `access_token=${res.data.access}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        router.push("/");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-4">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md z-10 backdrop-blur-sm bg-white/80 border-indigo-100 shadow-2xl shadow-indigo-100/50">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="admin@example.com" 
                          {...field} 
                          className="pl-10 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 pr-10 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? Contact your administrator.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
