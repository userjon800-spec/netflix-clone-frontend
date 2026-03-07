import { navUtil } from "@/utils";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  IoSearch,
  IoNotificationsOutline,
  IoChevronDown,
} from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
interface Util {
  title: string;
  menu: string | null;
  path?: string;
}
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};
export default function MenuBar() {
  const [toggle, setToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    axios
      .get("http://localhost:7800/api/me", { withCredentials: true })
      .then(({ data }) => {
        localStorage.setItem("userId", data.user._id);
        setUser(data.user);
      })
      .catch((err) => console.error(err));
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
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
        setSearchQuery("");
      }
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
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setToggle(false);
      setSearchQuery("");
    }
  };
  const logout = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:7800/api/logout",
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
    <div
      className={`fixed top-0 max-w-380 w-full my-1.5 h-fit z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black" : "bg-linear-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="px-16 py-2 flex items-center justify-between max-md:px-4">
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
              <a
                key={item.title}
                href={item.path || "#"}
                className="text-sm text-gray-200 hover:text-white transition-colors font-medium"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative" ref={searchRef}>
            {!toggle ? (
              <IoSearch
                className="text-2xl text-gray-200 hover:text-white cursor-pointer transition-colors"
                onClick={() => setToggle(true)}
              />
            ) : (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, people, genres"
                    className="bg-black/90 border border-white/30 text-white pl-10 pr-4 py-1.5 text-sm w-75 focus:outline-none focus:border-white transition-colors rounded-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setToggle(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </form>
            )}
          </div>
          <IoNotificationsOutline className="text-2xl text-gray-200 hover:text-white cursor-pointer transition-colors hidden md:block" />
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-sm overflow-hidden bg-red-600 flex items-center justify-center">
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
              <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-800 rounded-sm py-2 shadow-xl">
                <div className="px-4 py-2 border-b border-gray-800">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                >
                  Account
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
        {navUtil.map((item: Util) => (
          <a
            key={item.title}
            href={item.path || "#"}
            className="text-xs text-gray-200 hover:text-white whitespace-nowrap transition-colors"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}