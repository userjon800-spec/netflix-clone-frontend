"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { Movie } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useMovieActions() {
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const loadUserData = useCallback(async (currentUserId?: string | null) => {
    const id =
      currentUserId ||
      (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!id || !token) return;
    setUserId(id);

    try {
      const [likedRes, savedRes] = await Promise.all([
        api.get(`/user-liked/${id}`),
        api.get(`/user-saved/${id}`),
      ]);

      if (Array.isArray(likedRes.data)) {
        setLikedMovies(likedRes.data.map((m: any) => m.id));
      }
      if (Array.isArray(savedRes.data)) {
        setSavedMovies(savedRes.data.map((m: any) => m.id));
      }
    } catch (error) {
      console.error("Liked/Saved filmlarni yuklashda xatolik:", error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLike = async (movie: Movie) => {
    const currentUserId =
      userId ||
      (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

    if (!currentUserId) {
      toast.error("Filmni yoqtirish uchun avval tizimga kiring");
      router.push("/auth/signin");
      return;
    }

    try {
      setLikedMovies((prev) => [...prev, movie.id]);
      await api.post("/liked-movie", movie);
      toast.success("Film yoqtirilganlarga qo'shildi");
    } catch (error: any) {
      setLikedMovies((prev) => prev.filter((id) => id !== movie.id));
      toast.error(
        error.response?.data?.message || "Yoqtirishda xatolik yuz berdi",
      );
    }
  };

  const handleUnlike = async (movieId: number) => {
    try {
      setLikedMovies((prev) => prev.filter((id) => id !== movieId));
      await api.delete(`/un-liked-movie/${movieId}`);
      toast.success("Film yoqtirilganlardan o'chirildi");
    } catch (error: any) {
      setLikedMovies((prev) => [...prev, movieId]);
      toast.error(
        error.response?.data?.message || "O'chirishda xatolik yuz berdi",
      );
    }
  };

  const handleSave = async (movie: Movie) => {
    const currentUserId =
      userId ||
      (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

    if (!currentUserId) {
      toast.error("Filmni saqlash uchun avval tizimga kiring");
      router.push("/auth/signin");
      return;
    }

    try {
      setSavedMovies((prev) => [...prev, movie.id]);
      await api.post("/saved-movie", movie);
      toast.success("Film saqlanganlarga qo'shildi");
    } catch (error: any) {
      setSavedMovies((prev) => prev.filter((id) => id !== movie.id));
      toast.error(
        error.response?.data?.message || "Saqlashda xatolik yuz berdi",
      );
    }
  };

  const handleUnsave = async (movieId: number) => {
    try {
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
      await api.delete(`/un-saved-movie/${movieId}`);
      toast.success("Film saqlanganlardan o'chirildi");
    } catch (error: any) {
      setSavedMovies((prev) => [...prev, movieId]);
      toast.error(
        error.response?.data?.message || "O'chirishda xatolik yuz berdi",
      );
    }
  };

  const isLiked = (movieId: number) => likedMovies.includes(movieId);
  const isSaved = (movieId: number) => savedMovies.includes(movieId);

  return {
    likedMovies,
    savedMovies,
    handleLike,
    handleUnlike,
    handleSave,
    handleUnsave,
    isLiked,
    isSaved,
    reload: loadUserData,
  };
}
