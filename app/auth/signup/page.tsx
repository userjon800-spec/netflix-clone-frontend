"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { BASE_URL } from "@/utils";
export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const body = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      };
      const data = await axios.post(`${BASE_URL}/api/register`, body, {
        withCredentials: true,
      });
      if (data.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/api/me`, {
        credentials: "include",
      });
      if (res.ok) router.replace("/");
    })();
  }, [router]);
  return (
    <div className="min-h-screen relative bg-black flex flex-col z-30">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <Image
          className="w-full h-full object-cover opacity-50"
          src="/images/netflix-bg.jpg"
          alt="Netflix Background"
          fill
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-112.5 bg-black/85 rounded-md p-8 md:p-16 backdrop-blur-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <h1 className="text-white text-3xl font-bold mb-8">Sign Up</h1>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full h-14 px-4 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full h-14 px-4 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full h-14 px-4 bg-[#333333] text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors placeholder:text-gray-400"
                  required
                  minLength={4}
                />
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
            <p className="text-xs text-gray-500 -mt-2">
              Password must be at least 4 characters long
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f6121d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
            <div className="space-y-4">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-[#e50914] transition-colors font-medium"
                >
                  Sign in now
                </Link>
              </p>

              <p className="text-xs text-gray-500">
                This page is protected by Google reCAPTCHA to ensure you're not
                a bot.{" "}
                <button type="button" className="text-blue-500 hover:underline">
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
                  Or sign up with
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${BASE_URL}/api/auth/google`)
                }
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#404040] transition-colors text-sm"
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
                type="button"
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