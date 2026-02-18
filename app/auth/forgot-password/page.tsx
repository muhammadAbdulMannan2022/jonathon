"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, Key } from "lucide-react";
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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(values.email);
      if (res.success) {
        toast.success("OTP sent to your email!");
        // Store email in sessionStorage to use it on the verification page
        sessionStorage.setItem("reset_email", values.email);
        router.push("/auth/verify-otp");
      } else {
        toast.error(res.message || "Something went wrong");
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
              <Key className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Forgot Password</CardTitle>
          <CardDescription className="text-gray-500 text-base">
            No worries, we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium text-sm">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          className="pl-10 h-10 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-lg" 
                        />
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
                    Sending OTP...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center pb-8">
          <Link 
            href="/auth/login" 
            className="flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
