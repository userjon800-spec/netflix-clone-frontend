import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
  IoChevronForward,
  IoChevronBack,
  IoStar,
  IoFilmOutline,
} from "react-icons/io5";
import Loading from "./loading";
import MovieCard from "./movie-card";
import { Movie } from "@/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_KEY, BASE_URL } from "@/utils";
export default function TopRated() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
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
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
        );
        setTopRated(data.results || []);
        if (userId) {
          const [likedRes, savedRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/user-liked/${userId}`, {
              withCredentials: true,
            }),
            axios.get(`${BASE_URL}/api/user-saved/${userId}`, {
              withCredentials: true,
            }),
          ]);
          setLikedMovies(likedRes.data.map((item: any) => item.movieId));
          setSavedMovies(savedRes.data.map((item: any) => item.movieId));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load top rated movies");
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, [userId]);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
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
      await axios.delete(
        `${BASE_URL}/api/un-liked-movie/${movieId}`,
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
      await axios.delete(
        `${BASE_URL}/api/un-saved-movie/${movieId}`,
        { data: { userId: currentUserId }, withCredentials: true },
      );
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
      toast.success("Removed from saved movies");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unsave movie");
    }
  };
  const avgRating =
    topRated.length > 0
      ? (
          topRated.reduce((acc, movie) => acc + movie.vote_average, 0) /
          topRated.length
        ).toFixed(1)
      : "0";
  if (loading) return <Loading />;
  return (
    <div className="px-16 py-8 max-md:px-4 relative group max-w-380">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-white text-2xl font-bold">Top Rated Movies</h2>
          <div className="hidden md:flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
            <IoStar className="text-sm" />
            <span>IMDb Top</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>9.0+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>8.0-8.9</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>7.0-7.9</span>
        </div>
      </div>
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && topRated.length > 5 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <IoChevronBack className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <IoChevronForward className="text-2xl" />
            </button>
          </>
        )}
        <div
          ref={carouselRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {topRated.map((movie, index) => (
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
                showIndex={true}
                layout="carousel"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <IoFilmOutline />
          <span>{topRated.length} movies</span>
        </div>
        <div className="flex items-center gap-1">
          <IoStar className="text-yellow-400" />
          <span>Avg: {avgRating}</span>
        </div>
      </div>
    </div>
  );
}