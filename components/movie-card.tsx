"use client";
import { Movie } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IoPlay,
  IoHeartOutline,
  IoBookmarkOutline,
  IoHeart,
  IoBookmark,
  IoInformationCircleOutline,
} from "react-icons/io5";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (movie: Movie) => void;
  onSave?: (movie: Movie) => void;
  onUnlike?: (movieId: number) => void;
  onUnsave?: (movieId: number) => void;
  showIndex?: boolean;
  layout?: "grid" | "carousel";
}

export default function MovieCard({
  movie,
  index,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onUnlike,
  onUnsave,
  showIndex = false,
  layout = "grid",
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked && onUnlike) {
      onUnlike(movie.id);
    } else if (onLike) {
      onLike(movie);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved && onUnsave) {
      onUnsave(movie.id);
    } else if (onSave) {
      onSave(movie);
    }
  };

  const handleCardClick = () => {
    router.push(`/${movie.id}`);
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const posterUrl =
    movie.poster_path && !imageError
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;

  const cardWidth =
    layout === "carousel"
      ? "w-[170px] sm:w-[195px] md:w-[215px] shrink-0"
      : "w-full";

  return (
    <div
      onClick={handleCardClick}
      className={`group relative ${cardWidth} aspect-2/3 rounded-xl overflow-hidden cursor-pointer select-none bg-zinc-900 border border-white/5 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-950/30 hover:border-white/20`}
    >
      {/* Poster Rasmi */}
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={movie.title || movie.original_title || "Film"}
          fill
          sizes="(max-width: 640px) 170px, (max-width: 768px) 195px, 215px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={false}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-br from-zinc-800 to-zinc-900 text-center">
          <span className="text-3xl mb-2">🎬</span>
          <p className="text-xs font-semibold text-zinc-300 line-clamp-2">
            {movie.title || movie.original_title}
          </p>
        </div>
      )}

      {/* Yuqori burchak: Reyting & Sifat nishonlari */}
      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
        {rating && Number(rating) > 0 ? (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/20 shadow-sm flex items-center gap-1">
            <span className="text-[10px]">★</span>
            {rating}
          </span>
        ) : (
          <div />
        )}

        {showIndex && index !== undefined && index < 10 ? (
          <span className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-lg">
            {index + 1}
          </span>
        ) : (
          movie.adult && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600/90 text-white shadow-sm">
              18+
            </span>
          )
        )}
      </div>

      {/* Sokin holatdagi mini statuslar (foydalanuvchi yoqtirgan/saqlagan bo'lsa) */}
      <div className="absolute bottom-2.5 right-2.5 flex gap-1.5 z-10 transition-opacity duration-200 group-hover:opacity-0">
        {isLiked && (
          <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-red-500 shadow">
            <IoHeart className="text-xs" />
          </div>
        )}
        {isSaved && (
          <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-amber-400 shadow">
            <IoBookmark className="text-xs" />
          </div>
        )}
      </div>

      {/* Nafis Hover Pardasi (Posterni yopmaydi, faqat pastki qismda mayin paydo bo'ladi) */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-20">
        {/* Film nomi */}
        <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow-md mb-1">
          {movie.title || movie.original_title}
        </h3>

        {/* Qisqa meta ma'lumotlar */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium mb-3">
          {releaseYear && <span>{releaseYear}</span>}
          <span className="px-1.5 py-0.2 bg-white/10 rounded text-[9px] font-bold tracking-wider text-zinc-200 border border-white/10">
            HD
          </span>
          {movie.original_language && (
            <span className="uppercase text-[10px] text-zinc-400">
              • {movie.original_language}
            </span>
          )}
        </div>

        {/* Amallar tugmalari: Toza va Glassmorphic */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Play tugmasi */}
          <button
            type="button"
            onClick={handleCardClick}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
            title="Tomosha qilish"
            aria-label="Play movie"
          >
            <IoPlay className="text-sm ml-0.5" />
          </button>

          {/* Like tugmasi */}
          {onLike && (
            <button
              type="button"
              onClick={handleLikeClick}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border ${
                isLiked
                  ? "bg-red-600/30 text-red-500 border-red-500/40"
                  : "bg-black/50 text-white/80 border-white/20 hover:bg-black/70 hover:text-white"
              }`}
              title={isLiked ? "Yoqdi" : "Yoqtirish"}
              aria-label="Like movie"
            >
              {isLiked ? (
                <IoHeart className="text-sm" />
              ) : (
                <IoHeartOutline className="text-sm" />
              )}
            </button>
          )}

          {/* Save / Bookmark tugmasi */}
          {onSave && (
            <button
              type="button"
              onClick={handleSaveClick}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border ${
                isSaved
                  ? "bg-amber-600/30 text-amber-400 border-amber-500/40"
                  : "bg-black/50 text-white/80 border-white/20 hover:bg-black/70 hover:text-white"
              }`}
              title={isSaved ? "Saqlangan" : "Ro'yxatga saqlash"}
              aria-label="Save movie"
            >
              {isSaved ? (
                <IoBookmark className="text-sm" />
              ) : (
                <IoBookmarkOutline className="text-sm" />
              )}
            </button>
          )}

          {/* Batafsil / Info tugmasi */}
          <button
            type="button"
            onClick={handleCardClick}
            className="w-8 h-8 ml-auto rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 border border-white/20 flex items-center justify-center transition-all"
            title="Batafsil ma'lumot"
            aria-label="More details"
          >
            <IoInformationCircleOutline className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
