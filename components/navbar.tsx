'use client'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  IoHelpBuoyOutline,
  IoLanguageOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-sm py-2"
          : "bg-linear-to-b from-black/70 to-transparent py-4"
      }`}
    >
      <div className="max-w-380 mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              className="w-auto h-8 md:h-10 lg:h-12 object-contain"
              src="/images/logo.png"
              alt="Netflix Logo"
              width={160}
              height={50}
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 text-white border border-white/30 rounded px-3 py-1.5 text-sm hover:bg-white/10 transition-colors"
              >
                <IoLanguageOutline className="text-lg" />
                <span>English</span>
              </button>
              {showLanguages && (
                <div className="absolute top-full right-0 mt-2 bg-black/95 border border-gray-800 rounded-md py-2 min-w-37.5 shadow-xl">
                  <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                    English
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                    Русский
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                    O'zbek
                  </button>
                </div>
              )}
            </div>
            <Link
              href="/auth/signin"
              className="bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Sign In
            </Link>
          </nav>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <IoCloseOutline className="text-2xl" />
            ) : (
              <IoMenuOutline className="text-2xl" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-15 bg-black/95 border-t border-gray-800 p-4 animate-slideDown">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-300 text-sm">Language</span>
                <div className="flex gap-2">
                  <button className="text-white text-sm px-2 py-1 bg-red-600 rounded">
                    EN
                  </button>
                  <button className="text-gray-400 text-sm px-2 py-1 hover:text-white">
                    RU
                  </button>
                  <button className="text-gray-400 text-sm px-2 py-1 hover:text-white">
                    UZ
                  </button>
                </div>
              </div>
              <Link
                href="/help"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoHelpBuoyOutline className="text-lg" />
                <span className="text-sm">Help Centre</span>
              </Link>
              <Link
                href="/login"
                className="bg-red-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
        <div className="hidden md:flex items-center absolute right-0 top-1/2 -translate-y-1/2">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm"
          >
            <IoHelpBuoyOutline className="text-lg" />
            <span>Help</span>
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}