"use client";
import MenuBar from "@/components/menu-bar";
import Popular from "@/components/popular";
import TopRated from "@/components/top-rated";
import Trending from "@/components/trending";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:7800/api/me", {
        credentials: "include",
      });
      if (!res.ok) router.replace("/auth/signin");
    })();
  }, [router]);
  return (
    <div className="bg-black w-full h-fit p-3 flex items-center flex-col justify-around">
      <MenuBar />
      <Trending />
      <TopRated />
      <Popular />
    </div>
  );
}