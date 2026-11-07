"use client";
import { BASE_URL, navUtil } from "@/utils";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoSearch, IoChevronDown } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import { User } from "@/types";
import SearchAutocomplete from "@/components/search-autocomplete";

interface Util {
  title: string;
  menu: string | null;
  path?: string;
}
export default function MenuBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const profileRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    axios
      .get(`${BASE_URL}/api/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.user) {
          const id = data.user._id || data.user.id;
          if (id) localStorage.setItem("userId", id);
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Me fetch error:", err));
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/logout`,
        {},
        { withCredentials: true },
      );
      toast.success(data.message);
      setUser(undefined);
      localStorage.clear();
      setTimeout(() => router.replace("/auth/signin"), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SearchAutocomplete
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <div
        className={`fixed top-0 inset-x-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md shadow-2xl py-2.5"
            : "bg-linear-to-b from-black/90 via-black/50 to-transparent py-4"
        }`}
      >
        <div className="max-w-380 mx-auto px-6 md:px-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div onClick={() => router.push("/")} className="cursor-pointer">
              <Image
                width={100}
                height={30}
                src="/logo.svg"
                className="h-8 w-auto object-contain"
                alt="Netflix"
                priority
              />
            </div>
            <div className="hidden md:flex items-center gap-5">
              {navUtil.map((item: Util) => (
                <Link
                  key={item.title}
                  href={item.menu || "#"}
                  className="text-sm text-gray-200 hover:text-white transition-colors font-medium"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Qidiruv (Ctrl+K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
            >
              <IoSearch className="text-base text-gray-200" />
              <span className="hidden sm:inline text-xs text-gray-400">
                Qidiruv...
              </span>
              <kbd className="hidden md:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">
                Ctrl+K
              </kbd>
            </button>
            <div className="relative" ref={profileRef}>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-8 h-8 rounded-sm overflow-hidden bg-transparent flex items-center justify-center">
                  {user?.avatar ? (
                    <Image
                      width={32}
                      height={32}
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-2xl text-white" />
                  )}
                </div>
                <IoChevronDown
                  className={`text-white text-sm transition-transform duration-200 ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black/95 border z-50 border-gray-800 rounded-sm py-2 shadow-xl">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="text-sm text-white font-medium">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/help"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                  >
                    Help
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors border-t border-gray-800 mt-1"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden px-4 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide border-t border-gray-800">
          {navUtil.map((item: any) => (
            <Link
              key={item.title}
              href={item.menu || "/"}
              className="text-xs text-gray-200 hover:text-white whitespace-nowrap transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
