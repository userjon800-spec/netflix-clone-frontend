"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Movie } from "@/types";
import { API_KEY } from "@/utils";
import axios from "axios";
import {
  IoPlay,
  IoInformationCircleOutline,
  IoStar,
  IoHeart,
  IoHeartOutline,
  IoBookmark,
  IoBookmarkOutline,
} from "react-icons/io5";

interface HeroBillboardProps {
  onLike?: (movie: Movie) => void;
  onSave?: (movie: Movie) => void;
  onUnlike?: (movieId: number) => void;
  onUnsave?: (movieId: number) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export default function HeroBillboard({
  onLike,
  onSave,
  onUnlike,
  onUnsave,
  isLiked = false,
  isSaved = false,
}: HeroBillboardProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBillboardMovie = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`,
        );
        const results: Movie[] = data.results || [];
        // Eng sara backdrop_path ga ega 5 ta film ichidan tasodifiy tanlash
        const candidates = results.filter((m) => m.backdrop_path && m.overview);
        if (candidates.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * Math.min(candidates.length, 6),
          );
          setMovie(candidates[randomIndex]);
        }
      } catch (err) {
        console.error("Billboard movie fetch error:", err);
      }
    };
    fetchBillboardMovie();
  }, []);

  if (!movie) {
    return (
      <div className="w-full h-[65vh] md:h-[80vh] min-h-125 bg-linear-to-b from-zinc-900 to-black animate-pulse" />
    );
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] min-h-130 select-none">
      {/* Fon Rasmi (Backdrop) */}
      <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title || movie.original_title || "Billboard"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Chapdan o'ngga gradient (matn aniq o'qilishi uchun) */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent w-full md:w-3/4" />
        {/* Yuqoridan pastga gradient (navbarga va pastdagi karuselga silliq ulanish) */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />
      </div>

      {/* Kontent qismi */}
      <div className="relative h-full max-w-380 mx-auto px-6 md:px-16 flex flex-col justify-end pb-16 md:pb-24 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Badge & Meta */}
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <span className="px-2 py-0.5 rounded font-black bg-red-600 text-white tracking-wider text-[11px]">
              TRENDING #1
            </span>
            {rating && (
              <span className="flex items-center gap-1 font-bold text-amber-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-amber-400/20">
                <IoStar className="text-xs" />
                {rating}
              </span>
            )}
            {releaseYear && (
              <span className="text-zinc-300 font-medium">{releaseYear}</span>
            )}
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-zinc-300 border border-white/10">
              HD
            </span>
          </div>

          {/* Sarlavha */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
            {movie.title || movie.original_title}
          </h1>

          {/* Tavsif (Sinopsis) */}
          <p className="text-zinc-300 text-xs sm:text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow-md max-w-xl">
            {movie.overview}
          </p>

          {/* Tugmalar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Tugmasi */}
            <button
              onClick={() => router.push(`/${movie.id}`)}
              className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-black font-bold rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 shadow-xl text-sm md:text-base cursor-pointer"
            >
              <IoPlay className="text-xl md:text-2xl" />
              Tomosha qilish
            </button>

            {/* Batafsil Info Tugmasi */}
            <button
              onClick={() => router.push(`/${movie.id}`)}
              className="px-5 py-2.5 md:px-7 md:py-3 bg-zinc-600/60 backdrop-blur-md text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-zinc-600/40 transition-all active:scale-95 text-sm md:text-base cursor-pointer border border-white/10"
            >
              <IoInformationCircleOutline className="text-2xl" />
              Batafsil
            </button>

            {/* Like & Save kichik tugmalari */}
            {onLike && (
              <button
                onClick={() =>
                  isLiked && onUnlike ? onUnlike(movie.id) : onLike(movie)
                }
                className={`w-11 h-11 rounded-lg backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border cursor-pointer ${
                  isLiked
                    ? "bg-red-600/30 text-red-500 border-red-500/40"
                    : "bg-black/50 text-white/90 border-white/20 hover:bg-black/70 hover:text-white"
                }`}
                title={isLiked ? "Yoqdi" : "Yoqtirish"}
              >
                {isLiked ? (
                  <IoHeart className="text-xl" />
                ) : (
                  <IoHeartOutline className="text-xl" />
                )}
              </button>
            )}

            {onSave && (
              <button
                onClick={() =>
                  isSaved && onUnsave ? onUnsave(movie.id) : onSave(movie)
                }
                className={`w-11 h-11 rounded-lg backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border cursor-pointer ${
                  isSaved
                    ? "bg-amber-600/30 text-amber-400 border-amber-500/40"
                    : "bg-black/50 text-white/90 border-white/20 hover:bg-black/70 hover:text-white"
                }`}
                title={isSaved ? "Saqlangan" : "Saqlash"}
              >
                {isSaved ? (
                  <IoBookmark className="text-xl" />
                ) : (
                  <IoBookmarkOutline className="text-xl" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
