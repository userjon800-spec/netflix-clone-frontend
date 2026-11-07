"use client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import Loading from "./loading";
import MovieCard from "./movie-card";
import { Movie } from "@/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_KEY, BASE_URL } from "@/utils";
export default function Trending() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const id =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(id);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`,
        );
        setTrending(data.results || []);
        if (userId) {
          const [likedRes, savedRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/user-liked/${userId}`, {
              withCredentials: true,
            }),
            axios.get(`${BASE_URL}/api/user-saved/${userId}`, {
              withCredentials: true,
            }),
          ]);
          setLikedMovies(likedRes.data.map((item: any) => item.id));
          setSavedMovies(savedRes.data.map((item: any) => item.id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? -carouselRef.current.clientWidth * 0.75
          : carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const handleLike = async (movie: Movie) => {
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!currentUserId) {
      console.error("Please login to like movies");
      router.push("/auth/signin");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/liked-movie`,
        { ...movie, userId: currentUserId },
        { withCredentials: true },
      );
      setLikedMovies((prev) => [...prev, movie.id]);
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to like movie");
    }
  };
  const handleUnlike = async (movieId: number) => {
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!currentUserId) return;
    try {
      await axios.delete(`${BASE_URL}/api/un-liked-movie/${movieId}`, {
        data: { userId: currentUserId },
        withCredentials: true,
      });
      setLikedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to unlike movie");
    }
  };
  const handleSave = async (movie: Movie) => {
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!currentUserId) {
      console.error("Please login to save movies");
      router.push("/auth/signin");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/saved-movie`,
        { ...movie, userId: currentUserId },
        { withCredentials: true },
      );
      setSavedMovies((prev) => [...prev, movie.id]);
      toast.success("Added to saved movies");
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to save movie");
    }
  };
  const handleUnsave = async (movieId: number) => {
    const currentUserId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!currentUserId) return;
    try {
      await axios.delete(`${BASE_URL}/api/un-saved-movie/${movieId}`, {
        data: { userId: currentUserId },
        withCredentials: true,
      });
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
      toast.success("Removed from saved movies");
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to unsave movie");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="px-6 md:px-16 py-6 relative max-w-380 mx-auto w-full group/row">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-red-600 rounded-full" />
          Trenddagilar
          <span className="text-xs text-zinc-400 font-normal hidden sm:inline ml-2">
            Har kuni yangilanadi
          </span>
        </h2>
      </div>

      <div className="relative">
        {/* Chap strelka (Netflix Full-Height Paddle) */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 md:-left-6 top-0 bottom-0 w-10 md:w-12 bg-black/70 hover:bg-black/90 text-white z-30 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-xs rounded-r-lg shadow-2xl"
          aria-label="Scroll left"
        >
          <IoChevronBack className="text-2xl md:text-3xl transition-transform hover:scale-125" />
        </button>

        {/* O'ng strelka (Netflix Full-Height Paddle) */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 md:-right-6 top-0 bottom-0 w-10 md:w-12 bg-black/70 hover:bg-black/90 text-white z-30 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-xs rounded-l-lg shadow-2xl"
          aria-label="Scroll right"
        >
          <IoChevronForward className="text-2xl md:text-3xl transition-transform hover:scale-125" />
        </button>

        <div
          ref={carouselRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-3 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trending.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              isLiked={likedMovies.includes(movie.id)}
              isSaved={savedMovies.includes(movie.id)}
              onLike={handleLike}
              onSave={handleSave}
              onUnlike={handleUnlike}
              onUnsave={handleUnsave}
              showIndex={true}
              layout="carousel"
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
