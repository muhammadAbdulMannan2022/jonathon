"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";

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

const setNewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SetNewPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      toast.error("Session expired. Please try again.");
      router.push("/auth/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const form = useForm<z.infer<typeof setNewPasswordSchema>>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof setNewPasswordSchema>) {
    setIsLoading(true);
    try {
      const res = await authApi.setNewPassword({
        email: email!,
        new_password: values.password,
      });
      if (res.success) {
        toast.success("Password reset successful!");
        sessionStorage.removeItem("reset_email");
        router.push("/auth/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!email) return null;

  const password = form.watch("password");
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

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
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Set New Password</CardTitle>
          <CardDescription className="text-gray-500">
            Create a strong password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">New Password</FormLabel>
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
              
              <div className="bg-indigo-50/50 p-3 rounded-lg space-y-2 mb-2">
                <div className="flex items-center text-xs font-medium text-gray-600">
                  <CheckCircle2 className={`mr-2 h-3 w-3 ${hasMinLength ? 'text-green-500' : 'text-gray-300'}`} />
                  At least 6 characters
                </div>
                <div className="flex items-center text-xs font-medium text-gray-600">
                  <CheckCircle2 className={`mr-2 h-3 w-3 ${hasUpperCase ? 'text-green-500' : 'text-gray-300'}`} />
                  One uppercase letter (Optional but recommended)
                </div>
                <div className="flex items-center text-xs font-medium text-gray-600">
                  <CheckCircle2 className={`mr-2 h-3 w-3 ${hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                  One number (Optional but recommended)
                </div>
              </div>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 pr-10 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-xs text-gray-500 px-6">
            By updating your password, you agree to our security protocols and terms of service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
