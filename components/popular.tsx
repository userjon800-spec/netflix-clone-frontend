"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import Loading from "./loading";
import MovieCard from "./movie-card";
import { Movie } from "@/types";
import { API_KEY } from "@/utils";
import { useMovieActions } from "@/hooks/useMovieActions";

export default function Popular() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    likedMovies,
    savedMovies,
    handleLike,
    handleSave,
    handleUnlike,
    handleUnsave,
  } = useMovieActions();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        setPopular(data.results || []);
      } catch (error) {
        console.error("Popular fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? -carouselRef.current.clientWidth * 0.75
          : carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="relative group/section py-4">
      <div className="flex items-center justify-between mb-3 px-4 md:px-12">
        <h2 className="text-lg md:text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <span>Ommabop Filmlar</span>
          <span className="text-xs font-normal text-red-500 uppercase tracking-widest bg-red-600/10 px-2 py-0.5 rounded border border-red-500/20">
            Popular
          </span>
        </h2>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 md:w-14 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xs cursor-pointer"
          aria-label="Previous"
        >
          <IoChevronBack className="text-2xl md:text-3xl text-white drop-shadow-md" />
        </button>

        <div
          ref={carouselRef}
          className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 py-3 scroll-smooth"
        >
          {popular.map((movie) => (
            <div
              key={movie.id}
              className="shrink-0 w-[140px] sm:w-[165px] md:w-[190px] lg:w-[210px]"
            >
              <MovieCard
                movie={movie}
                isLiked={likedMovies.includes(movie.id)}
                isSaved={savedMovies.includes(movie.id)}
                onLike={handleLike}
                onSave={handleSave}
                onUnlike={handleUnlike}
                onUnsave={handleUnsave}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 md:w-14 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xs cursor-pointer"
          aria-label="Next"
        >
          <IoChevronForward className="text-2xl md:text-3xl text-white drop-shadow-md" />
        </button>
      </div>
    </div>
  );
}
