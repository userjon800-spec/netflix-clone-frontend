"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_KEY } from "@/utils";
import { Movie } from "@/types";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoTimeOutline,
  IoFlameOutline,
  IoStarOutline,
  IoFilmOutline,
  IoArrowForwardOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

interface SearchAutocompleteProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_TAGS = [
  "Avatar",
  "Oppenheimer",
  "Spider-Man",
  "Batman",
  "Interstellar",
  "John Wick",
  "Marvel",
  "Anime",
];

const QUICK_GENRES = [
  { name: "Ekshn (Action)", path: "/action" },
  { name: "Komediya (Comedy)", path: "/comedy" },
  { name: "Daxshat (Horror)", path: "/horror" },
  { name: "Animatsiya", path: "/animation" },
  { name: "Kutilayotganlar", path: "/upcoming" },
];

export default function SearchAutocomplete({
  isOpen,
  onClose,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("netflix_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live search debounced query
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query.trim(),
          )}&api_key=${API_KEY}&page=1`,
        );
        setResults((data.results || []).slice(0, 5));
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Save to recent searches
  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = [
      trimmed,
      ...recentSearches.filter(
        (s) => s.toLowerCase() !== trimmed.toLowerCase(),
      ),
    ].slice(0, 6);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("netflix_recent_searches", JSON.stringify(updated));
    }
  };

  const removeRecentSearch = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== text);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("netflix_recent_searches", JSON.stringify(updated));
    }
  };

  const handleSearchSubmit = (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;
    saveRecentSearch(term);
    onClose();
    router.push(`/search/${encodeURIComponent(term)}`);
  };

  const handleMovieClick = (movieId: number, movieTitle?: string) => {
    if (movieTitle) saveRecentSearch(movieTitle);
    onClose();
    router.push(`/${movieId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 relative bg-white/2">
          <IoSearchOutline className="text-xl text-red-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(query);
              }
            }}
            placeholder="Film nomi, aktyor yoki janrni qidiring..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-base focus:outline-none"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <IoCloseOutline className="text-lg" />
            </button>
          )}

          <button
            onClick={onClose}
            className="text-xs bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Dynamic Results & Suggestions Body */}
        <div className="overflow-y-auto p-4 space-y-6">
          {/* 1. Live Movie Results (when typing) */}
          {query.trim().length >= 2 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5 text-white">
                  <IoFilmOutline className="text-red-500 text-sm" />
                  Jonli Natijalar
                </span>
                {loading && (
                  <span className="text-[11px] text-red-500 animate-pulse">
                    Qidirilmoqda...
                  </span>
                )}
              </div>

              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id, movie.title)}
                      className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5 group"
                    >
                      <div className="w-12 h-16 relative bg-gray-900 rounded-lg overflow-hidden shrink-0 border border-white/5">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title || "Movie"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-600">
                            No poster
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-red-500 transition-colors truncate">
                          {movie.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>
                            {movie.release_date?.slice(0, 4) || "Noma'lum"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                            <IoStarOutline className="text-xs" />
                            {movie.vote_average
                              ? movie.vote_average.toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <IoArrowForwardOutline className="text-gray-500 group-hover:text-white transition-colors text-base mr-2 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}

                  <button
                    onClick={() => handleSearchSubmit(query)}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 border border-red-500/20 transition-all cursor-pointer"
                  >
                    <span>"{query}" uchun barcha natijalarni ko'rish</span>
                    <IoArrowForwardOutline />
                  </button>
                </div>
              ) : !loading ? (
                <div className="py-6 text-center text-gray-500 text-xs">
                  "{query}" bo'yicha hech qanday film topilmadi
                </div>
              ) : null}
            </div>
          )}

          {/* 2. Recent Searches (YouTube Style) */}
          {recentSearches.length > 0 && query.trim().length === 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                <span className="flex items-center gap-1.5">
                  <IoTimeOutline className="text-sm" />
                  So'nggi qidiruvlar
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("netflix_recent_searches");
                    }
                  }}
                  className="text-[11px] text-gray-500 hover:text-gray-300 normal-case font-normal cursor-pointer"
                >
                  Tozalash
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchSubmit(term)}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white cursor-pointer border border-white/5 transition-all"
                  >
                    <IoTimeOutline className="text-gray-500 group-hover:text-gray-300 text-xs" />
                    <span>{term}</span>
                    <button
                      onClick={(e) => removeRecentSearch(term, e)}
                      className="text-gray-500 hover:text-red-400 p-0.5 rounded-full"
                    >
                      <IoCloseOutline className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Trending Tags (YouTube Style Recommendations) */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              <IoFlameOutline className="text-red-500 text-sm" />
              <span>Ommabop Qidiruvlar</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearchSubmit(tag)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-600/20 hover:border-red-500/40 text-xs font-medium text-gray-300 hover:text-white cursor-pointer border border-white/5 transition-all"
                >
                  <IoTrendingUpOutline className="text-red-500 text-xs" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Quick Genre Shortcuts */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              Tezkor Janrlar
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_GENRES.map((g) => (
                <button
                  key={g.path}
                  onClick={() => {
                    onClose();
                    router.push(g.path);
                  }}
                  className="p-2.5 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 text-left text-xs font-medium text-gray-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{g.name}</span>
                  <IoArrowForwardOutline className="text-gray-600 text-xs" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
