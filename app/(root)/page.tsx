"use client";
import MenuBar from "@/components/menu-bar";
import Popular from "@/components/popular";
import TopRated from "@/components/top-rated";
import Trending from "@/components/trending";
import { BASE_URL } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IoKeyOutline,
  IoCloseOutline,
  IoCheckmarkCircle,
  IoInformationCircle,
  IoBanOutline,
} from "react-icons/io5";
export default function Home() {
  const router = useRouter();
  const [showReminder, setShowReminder] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          router.replace("/auth/signin");
          return;
        }
        const { user } = await res.json();
        setUserEmail(user.email);
        const reminderHidden =
          typeof window !== "undefined" ? localStorage.getItem("hidePasswordReminder") : null;
        if (!user.password && !reminderHidden) {
          setShowReminder(true);
          toast(
            (t) => (
              <div className="bg-[#1e1e1e] border border-[#333] rounded shadow-lg p-4 max-w-md">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-[#e50914]/10 rounded-full flex items-center justify-center">
                      <IoInformationCircle className="text-[#e50914] text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">
                      Xavfsizlik maslahati
                    </h3>
                    <p className="text-[#b3b3b3] text-sm mb-3">
                      Akkauntingizni himoyalash uchun parol o'rnatishingizni
                      tavsiya qilamiz
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/profile"
                        className="text-sm bg-[#e50914] hover:bg-[#f6121d] text-white px-3 py-1.5 rounded transition-colors"
                        onClick={() => toast.dismiss(t.id)}
                      >
                        Parol o'rnatish
                      </Link>
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-sm text-[#b3b3b3] hover:text-white transition-colors"
                      >
                        Keyinroq
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ),
            {
              duration: 8000,
              position: "bottom-center",
              style: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
              },
            },
          );
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    })();
  }, [router]);
  const handleDontShowAgain = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    typeof window !== "undefined" ? localStorage.setItem("hidePasswordReminder", 'true') : null;
    setDontShowAgain(true);
    setShowReminder(false);
    toast.success("Eslatma o'chirildi", {
      icon: <IoCheckmarkCircle className="text-green-500" />,
      duration: 3000,
    });
  };
  const handleCloseBanner = () => {
    setShowReminder(false);
  };
  return (
    <div className="bg-black relative flex flex-col items-center">
      {showReminder && !dontShowAgain && (
        <div className="fixed top-0 left-0 right-0 z-100 bg-[#181818] border-b border-[#333] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <div className="w-10 h-10 bg-[#e50914]/10 rounded-full flex items-center justify-center">
                    <IoKeyOutline className="text-[#e50914] text-lg" />
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm md:text-base">
                    <span className="font-medium">{userEmail}</span>
                  </p>
                  <p className="text-[#b3b3b3] text-xs md:text-sm">
                    Akkauntingiz xavfsizligi uchun parol o'rnatishingizni
                    tavsiya qilamiz
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="text-sm bg-[#e50914] hover:bg-[#f6121d] text-white px-4 py-1.5 rounded transition-colors whitespace-nowrap"
                  onClick={handleCloseBanner}
                >
                  Parol o'rnatish
                </Link>
                <button
                  onClick={handleDontShowAgain}
                  className="hidden md:flex items-center gap-1 text-xs text-[#b3b3b3] hover:text-white px-2 py-1.5 rounded hover:bg-[#333] transition-colors"
                  title="Boshqa ko'rsatma"
                >
                  <IoBanOutline className="text-sm" />
                  <span>Ko'rsatma</span>
                </button>
                <button
                  onClick={handleCloseBanner}
                  className="p-1.5 hover:bg-[#333] rounded-full transition-colors"
                  aria-label="Yopish"
                >
                  <IoCloseOutline className="text-[#b3b3b3] hover:text-white text-xl" />
                </button>
              </div>
            </div>
            <div className="md:hidden flex justify-end mt-2">
              <button
                onClick={handleDontShowAgain}
                className="flex items-center gap-1 text-xs text-[#b3b3b3] hover:text-white px-2 py-1 rounded hover:bg-[#333] transition-colors"
              >
                <IoBanOutline className="text-sm" />
                <span>Boshqa ko'rsatma</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`transition-all border duration-300 ${showReminder && !dontShowAgain ? "pt-18 md:pt-18" : "pt-[-15px]"}`}
      >
        <MenuBar />
        <Trending />
        <TopRated />
        <Popular />
      </div>
    </div>
  );
}