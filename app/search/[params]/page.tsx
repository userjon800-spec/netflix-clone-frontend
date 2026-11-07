"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "@/components/loading";
import { Movie } from "@/types";
import { API_KEY } from "@/utils";
import { useMovieActions } from "@/hooks/useMovieActions";

export default function SearchPage() {
  const params = useParams();
  const router = useRouter();
  const query = params.params as string;
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterTag, setFilterTag] = useState<string>("all");
  const {
    likedMovies,
    savedMovies,
    handleLike,
    handleSave,
    handleUnlike,
    handleUnsave,
  } = useMovieActions();

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
  const filteredResults = results.filter((movie) => {
    if (filterTag === "top_rated") return (movie.vote_average || 0) >= 7.0;
    if (filterTag === "new") {
      const year = new Date(movie.release_date || "").getFullYear();
      return year >= 2023;
    }
    if (filterTag === "popular") return (movie.popularity || 0) >= 50;
    return true;
  });

  const filterChips = [
    { id: "all", label: "Hammasi" },
    { id: "top_rated", label: "★ Yuqori reytingli" },
    { id: "new", label: "Yangi filmlar (2023+)" },
    { id: "popular", label: "Ommabop" },
  ];

  if (loading && page === 1) return <Loading />;
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              "{decodeURIComponent(query)}" uchun qidiruv natijalari
            </h1>
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <input
                type="text"
                name="search"
                defaultValue={decodeURIComponent(query)}
                placeholder="Search movies..."
                className="w-full h-11 pl-11 pr-4 bg-white/5 text-white rounded-xl border border-white/10 focus:border-red-600 focus:outline-none transition-colors text-sm"
              />
              <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            </form>
          </div>
          <p className="text-gray-400 text-xs">
            Jami{" "}
            <span className="text-white font-semibold">{totalResults}</span> ta
            film topildi
          </p>

          {/* YouTube Style Filter Chips */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterTag(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  filterTag === chip.id
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {filteredResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {filteredResults.map((movie) => (
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
