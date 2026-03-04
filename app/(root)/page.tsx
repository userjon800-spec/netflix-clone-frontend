"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import toast from "react-hot-toast";
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
  return <div></div>;
}