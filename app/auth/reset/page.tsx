"use client";
import Navbar from "@/components/navbar";
import { BASE_URL } from "@/utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoMailOutline,
  IoKeyOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
export default function ResetPasswordPage() {
  const [onPassword, setOnPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReplacePassword, setShowReplacePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setEmail] = useState("");
  const router = useRouter();
  const reset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;
    const resetCode = formData.get("reset-code") as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (resetCode.length < 6) {
      toast.error("Reset code must be at least 6 digits");
      setIsLoading(false);
      return;
    }
    try {
      const reset = await axios.post(
        `${BASE_URL}/api/reset`,
        {
          email: emailValue,
          reset: resetCode,
        },
        { withCredentials: true },
      );
      localStorage.setItem("userIds", reset.data.userId);
      setEmail(emailValue);
      if (reset.status === 200) {
        toast.success("Code verified! Please set your new password");
        setOnPassword(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid code or email");
    } finally {
      setIsLoading(false);
    }
  };
  const newPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const replacePassword = formData.get("replace-password") as string;
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    if (password !== replacePassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      const reset = await axios.post(
        `${BASE_URL}/api/new-password`,
        {
          password: password,
          id: localStorage.getItem("userIds"),
        },
        { withCredentials: true },
      );
      if (reset.status === 200) {
        toast.success(reset.data.message || "Password reset successfully!");
        localStorage.clear();
        setTimeout(() => router.replace("/auth/signin"), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <Image
          className="w-full h-full object-cover opacity-40"
          src="/images/netflix-bg.jpg"
          alt="Netflix Background"
          fill
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/50" />
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-24 md:py-32">
        <div className="w-full max-w-112.5 bg-black/85 rounded-md p-8 md:p-12 backdrop-blur-sm border border-gray-800">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <IoArrowBackOutline />
            Back to Sign In
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {onPassword ? "Set New Password" : "Reset Password"}
            </h1>
            <p className="text-gray-400 text-sm">
              {onPassword
                ? "Enter your new password below"
                : "Enter your email and the 6-digit reset code"}
            </p>
          </div>
          {onPassword ? (
            <form onSubmit={newPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    defaultValue={""}
                    className="w-full h-12 px-4 pr-12 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showReplacePassword ? "text" : "password"}
                    name="replace-password"
                    required
                    defaultValue={""}
                    minLength={6}
                    className="w-full h-12 px-4 pr-12 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowReplacePassword(!showReplacePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showReplacePassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-md space-y-2">
                <p className="text-sm text-gray-300">Password must:</p>
                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                  <li>Be at least 6 characters long</li>
                  <li>Include at least one number</li>
                  <li>Include at least one letter</li>
                </ul>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f6121d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={reset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full h-12 px-4 pl-11 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                  <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 block">
                  6-Digit Reset Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="reset-code"
                    required
                    maxLength={10}
                    className="w-full h-12 px-4 pl-11 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Enter 6-digit code"
                  />
                  <IoKeyOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Code must be 6-10 digits long
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4">
                <p className="text-sm text-blue-400">
                  Check your email for the reset code. If you haven't received
                  it, check your spam folder.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f6121d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </button>
            </form>
          )}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                className="text-white hover:text-[#e50914] transition-colors"
              >
                Sign in
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <button className="text-blue-500 hover:underline">
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}