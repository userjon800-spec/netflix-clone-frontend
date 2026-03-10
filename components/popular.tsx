import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
  IoChevronForward,
  IoChevronBack,
  IoTrendingUp,
  IoTimeOutline,
  IoStarOutline,
} from "react-icons/io5";
import Loading from "./loading";
import MovieCard from "./movie-card";
import { Movie } from "@/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Popular() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const router = useRouter();
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY_API as string;
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
        );
        setPopular(data.results || []);
        if (userId) {
          const [likedRes, savedRes] = await Promise.all([
            axios.get(`http://localhost:7800/api/user-liked/${userId}`, {
              withCredentials: true,
            }),
            axios.get(`http://localhost:7800/api/user-saved/${userId}`, {
              withCredentials: true,
            }),
          ]);
          setLikedMovies(likedRes.data.map((item: any) => item.movieId));
          setSavedMovies(savedRes.data.map((item: any) => item.movieId));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load popular movies");
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, [API_KEY, userId]);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const formatPopularity = (pop: number) => {
    if (pop > 1000) return `${(pop / 1000).toFixed(1)}K`;
    return Math.round(pop).toString();
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
        "http://localhost:7800/api/liked-movie",
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
      await axios.delete(
        `http://localhost:7800/api/un-liked-movie/${movieId}`,
        { data: { userId: currentUserId }, withCredentials: true },
      );
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
        "http://localhost:7800/api/saved-movie",
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
      await axios.delete(
        `http://localhost:7800/api/un-saved-movie/${movieId}`,
        { data: { userId: currentUserId }, withCredentials: true },
      );
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
      toast.success("Removed from saved movies");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unsave movie");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="px-16 py-8 max-md:px-4 relative group max-w-380">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-full">
            <IoTrendingUp className="text-white text-xl" />
          </div>
          <h2 className="text-white text-2xl font-bold">Popular Now</h2>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
            Weekly Top 20
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <IoTimeOutline />
            <span>Updated daily</span>
          </div>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="flex items-center gap-1">
            <IoStarOutline />
            <span>{popular.length} movies</span>
          </div>
        </div>
      </div>
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && popular.length > 5 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <IoChevronBack className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <IoChevronForward className="text-2xl" />
            </button>
          </>
        )}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {popular.map((movie, index) => (
            <div key={movie.id} className="relative">
              <MovieCard
                movie={movie}
                index={index}
                isLiked={likedMovies.includes(movie.id)}
                isSaved={savedMovies.includes(movie.id)}
                onLike={handleLike}
                onSave={handleSave}
                onUnlike={handleUnlike}
                onUnsave={handleUnsave}
                showIndex={false}
                layout="carousel"
              />
              <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                <IoTrendingUp className="text-red-500 text-xs" />
                <span>{formatPopularity(movie.popularity)}</span>
              </div>
              {movie.vote_count > 1000 && (
                <div className="absolute bottom-2 right-2 z-20 text-xs bg-yellow-500 text-black px-2 py-1 rounded font-medium">
                  HD
                </div>
              )}
              {index < 3 && (
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 z-20 ${
                    index === 0
                      ? "bg-yellow-500 border-yellow-300 text-black"
                      : index === 1
                        ? "bg-gray-400 border-gray-300 text-black"
                        : "bg-amber-700 border-amber-600 text-white"
                  }`}
                >
                  #{index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>High rating (7.5+)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span>Good rating (6.0-7.4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Average (below 6.0)</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <IoTrendingUp className="text-red-500" />
          <span>Popularity score</span>
        </div>
      </div>
    </div>
  );
}