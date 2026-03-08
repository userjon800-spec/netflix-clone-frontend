"use client";
import MenuBar from "@/components/menu-bar";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoSearchOutline,
  IoFilmOutline,
  IoStarOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import Loading from "@/components/loading";
import { Movie } from "@/types";
export default function SearchPage() {
  const params = useParams();
  const router = useRouter();
  const query = params.params as string;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY_API;
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
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
  }, [query, API_KEY, page]);
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };
  const getRatingPercentage = (rating: number) => {
    return Math.round(rating * 10);
  };
  const formatYear = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("search") as string;
    if (newQuery.trim()) {
      router.push(`/search/${encodeURIComponent(newQuery)}`);
    }
  };
  if (loading && page === 1) return <Loading />;
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-380 mx-auto px-4 md:px-8 pt-24 pb-16">
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
                <Link
                  key={movie.id}
                  href={`/${movie.id}`}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  <div className="relative aspect-2/3 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-700 p-4">
                        <IoFilmOutline className="text-5xl text-gray-500 mb-2" />
                        <p className="text-xs text-gray-400 text-center">
                          No poster available
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {movie.vote_average > 0 && (
                      <div
                        className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-bold ${getRatingColor(movie.vote_average)}`}
                      >
                        <IoStarOutline className="text-yellow-500" />
                        <span>{getRatingPercentage(movie.vote_average)}%</span>
                      </div>
                    )}
                    {movie.release_date && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs text-gray-300">
                        <IoCalendarOutline />
                        <span>{formatYear(movie.release_date)}</span>
                      </div>
                    )}
                    {hoveredMovie === movie.id && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black to-transparent">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                          {movie.title}
                        </h3>
                        <p className="text-gray-300 text-xs line-clamp-2 mb-2">
                          {movie.overview || "No overview available"}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">
                            {movie.vote_count} votes
                          </span>
                          <span className="text-red-500 hover:text-red-400 transition-colors">
                            View details →
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-300 line-clamp-1 md:hidden">
                    {movie.title}
                  </p>
                  {movie.release_date && (
                    <p className="text-xs text-gray-500 md:hidden">
                      {formatYear(movie.release_date)}
                    </p>
                  )}
                </Link>
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