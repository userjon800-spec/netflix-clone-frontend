"use client";
import { BASE_URL } from "@/utils";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/logout`,
        {},
        { withCredentials: true },
      );
      toast.success(data.message);
      localStorage.clear();
      setTimeout(() => router.replace("/auth/signin"), 1500);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <footer className="bg-black w-full z-50 relative">
      <div className="max-w-380 mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-10 lg:py-12">
        <div className="mb-6 md:mb-8">
          <h2 className="text-[#b3b3b3] text-base md:text-lg font-normal hover:text-white transition-colors">
            <a href="tel:998933547854" className="hover:underline">
              Questions? Call +998 93&#41;354-78-54
            </a>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8">
          <div className="flex flex-col space-y-3">
            <Link
              href="/help"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Investor Relations
            </Link>
            <Link
              href="/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Speed Test
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              href="/help"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Help Centre
            </Link>
            <Link
              href="/about"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Cookie Preferences
            </Link>
            <Link
              href="/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Legal Notices
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              href="/profile"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Account
            </Link>
            <Link
              href="https://help.netflix.com/ru/contactus"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Netflix
            </Link>
            <Link
              href="/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Corporate Information
            </Link>
            <Link
              href="https://www.netflix.com/uz-ru/"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Only on Netflix
            </Link>
          </div>
          <div className="flex flex-col items-start space-y-3">
            <button
              onClick={logout}
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Sign Out
            </button>
            <Link
              href="https://help.netflix.com/legal/termsofuse"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="https://t.me/Xamdamb0yev"
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="mb-6">
          <select
            className="bg-black text-[#b3b3b3] border border-[#4d4d4d] px-4 py-2 text-sm rounded hover:border-white transition-colors cursor-pointer outline-none focus:border-white"
            aria-label="Language Selector"
          >
            <option value="en" className="bg-black text-white">
              English
            </option>
            <option value="ru" className="bg-black text-white">
              Russian
            </option>
            <option value="uz" className="bg-black text-white">
              Uzbek
            </option>
          </select>
        </div>
        <div className="border-t border-[#4d4d4d] pt-6 mt-4">
          <div className="text-center">
            <Link
              href="https://t.me/Xamdamb0yev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b3b8d] text-sm md:text-base font-medium hover:text-[#4b4bb5] transition-colors inline-block mb-2"
            >
              Developed with ❤️ by Javohir
            </Link>
            <p className="text-[#b3b3b3] text-xs md:text-sm">
              © Copyright {currentYear} | Designed & Developed by Javohir
              Xamdamboyev | All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}