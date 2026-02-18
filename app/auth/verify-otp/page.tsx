"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MailOpen, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authApi } from "@/lib/auth-service";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      toast.error("Session expired. Please try again.");
      router.push("/auth/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleVerify() {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(email!, otp);
      if (res.success) {
        toast.success("OTP verified successfully!");
        // Keep email for next step
        router.push("/auth/set-new-password");
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (timer > 0) return;
    
    setIsResending(true);
    try {
      const res = await authApi.resendOtp(email!);
      if (res.success) {
        toast.success("New OTP sent to your email!");
        setTimer(30);
        setOtp("");
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md z-10 backdrop-blur-sm bg-white/80 border-indigo-100 shadow-2xl shadow-indigo-100/50 text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <MailOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Verify OTP</CardTitle>
          <CardDescription className="text-gray-500 text-base">
            We've sent a code to <span className="font-semibold text-gray-800">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-center pt-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-l-xl" />
                <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-r-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleVerify}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Securely"
              )}
            </Button>

            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="flex items-center justify-center w-full text-sm font-medium text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className={`mr-2 h-4 w-4 ${timer > 0 ? '' : 'animate-pulse'}`} />
              )}
              {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center pb-8 border-t border-gray-50 mt-4">
          <Link 
            href="/auth/forgot-password" 
            className="flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors group mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Use a different email
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
