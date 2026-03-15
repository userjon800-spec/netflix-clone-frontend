"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "@/components/loading";
import { Movie } from "@/types";
import { API_KEY, BASE_URL } from "@/utils";
import toast from "react-hot-toast";
export default function SearchPage() {
  const params = useParams();
  const router = useRouter();
  const query = params.params as string;
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);
  useEffect(() => {
    if (!userId) return;
    Promise.all([
      axios.get(`${BASE_URL}/api/user-liked/${userId}`, {
        withCredentials: true,
      }),
      axios.get(`${BASE_URL}/api/user-saved/${userId}`, {
        withCredentials: true,
      }),
    ])
      .then(([likedRes, savedRes]) => {
        setLikedMovies(likedRes.data.map((item: any) => item.movieId));
        setSavedMovies(savedRes.data.map((item: any) => item.movieId));
      })
      .catch((err) => console.error(err));
  }, [userId]);
  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}&page=${page}`,
        );
        setResults(data.results || []);
        setTotalResults(data.total_results || 0);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    searchMovies();
  }, [query, page]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("search") as string;
    if (newQuery.trim()) {
      setPage(1);
      router.push(`/search/${encodeURIComponent(newQuery)}`);
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
  if (loading && page === 1) return <Loading />;
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Search Results for "{decodeURIComponent(query)}"
            </h1>
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <input
                type="text"
                name="search"
                defaultValue={decodeURIComponent(query)}
                placeholder="Search movies..."
                className="w-full h-12 pl-12 pr-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
              />
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </form>
          </div>
          <p className="text-gray-400">
            Found{" "}
            <span className="text-white font-semibold">{totalResults}</span>{" "}
            movies
          </p>
        </div>
        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {results.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isLiked={likedMovies.includes(movie.id)}
                  isSaved={savedMovies.includes(movie.id)}
                  onLike={handleLike}
                  onSave={handleSave}
                  onUnlike={handleUnlike}
                  onUnsave={handleUnsave}
                  layout="grid"
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800/50 rounded-full mb-4">
              <IoSearchOutline className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl text-gray-300 font-medium mb-2">
              No movies found
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              We couldn't find any movies matching "{decodeURIComponent(query)}
              ". Try searching with different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}