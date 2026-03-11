"use client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import Loading from "./loading";
import MovieCard from "./movie-card";
import { LikedMovie, SavedMovie, Movie } from "@/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_KEY, BASE_URL } from "@/utils";
export default function Trending() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("userId");
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
          setLikedMovies(likedRes.data.map((item: LikedMovie) => item.movieId));
          setSavedMovies(savedRes.data.map((item: SavedMovie) => item.movieId));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const handleLike = async (movie: Movie) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      toast.error("Please login to like movies");
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
      toast.success("Added to liked movies");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to like movie");
    }
  };
  const handleUnlike = async (movieId: number) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) return;
    try {
      await axios.delete(`${BASE_URL}/api/un-liked-movie/${movieId}`, {
        data: { userId: currentUserId },
        withCredentials: true,
      });
      setLikedMovies((prev) => prev.filter((id) => id !== movieId));
      toast.success("Removed from liked movies");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unlike movie");
    }
  };
  const handleSave = async (movie: Movie) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      toast.error("Please login to save movies");
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
      toast.error(error.response?.data?.message || "Failed to save movie");
    }
  };
  const handleUnsave = async (movieId: number) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) return;
    try {
      await axios.delete(`${BASE_URL}/api/un-saved-movie/${movieId}`, {
        data: { userId: currentUserId },
        withCredentials: true,
      });
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
      toast.success("Removed from saved movies");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unsave movie");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="px-16 py-8 max-md:px-4 relative group max-w-380 my-5 mt-8">
      <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
        Trending Now
        <span className="text-sm text-gray-400 font-normal">Updated daily</span>
      </h2>
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Scroll left"
            >
              <IoChevronBack className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Scroll right"
            >
              <IoChevronForward className="text-2xl" />
            </button>
          </>
        )}
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
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