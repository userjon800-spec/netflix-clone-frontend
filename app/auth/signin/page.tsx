"use client";
import Navbar from "@/components/navbar";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { BASE_URL } from "@/utils";
export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const body = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email as string)) {
        toast.error("Please enter a valid email address");
        setIsLoading(false);
        return;
      }
      if ((body.password as string).length < 4) {
        toast.error("Password must be at least 4 characters");
        setIsLoading(false);
        return;
      }
      const { data, status } = await axios.post(`${BASE_URL}/api/login`, body, {
        withCredentials: true,
      });
      if (data.user.role === "admin") {
        router.push("/admin");
        return;
      }else if (status === 200) {
        toast.success(data.message || "Successfully signed in!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/me`, {
          credentials: "include",
        });
        if (res.ok) router.replace("/");
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [router]);
  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <Image
          className="w-full h-full object-cover opacity-50"
          src="/images/netflix-bg.jpg"
          alt="Netflix Background"
          fill
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-112.5 bg-black/85 rounded-md p-8 md:p-16 backdrop-blur-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <h1 className="text-white text-3xl font-bold mb-8">Sign In</h1>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="w-full h-14 px-4 pt-2 pb-1 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors peer"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                  Email or phone number
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full h-14 px-4 pt-2 pb-1 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors peer"
                  required
                  minLength={4}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs transition-all">
                  Password
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f6121d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-[#333333] border-gray-600 rounded focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <IoInformationCircleOutline size={18} />
                Need help?
              </button>
            </div>
            {showHelp && (
              <div className="bg-[#1e1e1e] p-4 rounded-md text-sm space-y-2">
                <p className="text-gray-300">Having trouble signing in?</p>
                <ul className="text-gray-400 list-disc pl-4 space-y-1">
                  <li>Check your email and password</li>
                  <li>Make sure caps lock is off</li>
                  <li>Try resetting your password</li>
                </ul>
                <Link
                  href="/auth/reset"
                  className="text-[#e50914] hover:underline block mt-2"
                >
                  Reset password
                </Link>
              </div>
            )}
            <div className="space-y-4">
              <p className="text-gray-400">
                New to Netflix?{" "}
                <Link
                  href="/auth/signup"
                  className="text-white hover:text-[#e50914] transition-colors font-medium"
                >
                  Sign up now
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                This page is protected by Google reCAPTCHA to ensure you're not
                a bot.{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => toast("reCAPTCHA verification is enabled")}
                >
                  Learn more
                </button>
              </p>
            </div>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-black text-gray-500">
                  Or sign in with
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#404040] transition-colors text-sm"
                onClick={() =>
                  (window.location.href = `${BASE_URL}/api/auth/github`)
                }
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#404040] transition-colors text-sm"
                onClick={() =>
                  (window.location.href = `${BASE_URL}/api/auth/github`)
                }
              >
                <FaGithub className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
