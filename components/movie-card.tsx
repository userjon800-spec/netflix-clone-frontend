"use client";
import { Movie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IoPlay,
  IoHeartOutline,
  IoBookmarkOutline,
  IoHeart,
  IoBookmark,
  IoCalendarOutline,
} from "react-icons/io5";
interface MovieCardProps {
  movie: Movie;
  index?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (movie: any) => void;
  onSave?: (movie: any) => void;
  onUnlike?: (movieId: number) => void;
  onUnsave?: (movieId: number) => void;
  showIndex?: boolean;
}
export default function MovieCard({
  movie,
  index,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onUnlike,
  onUnsave,
  showIndex = false,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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
  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-2/3 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.original_title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <span className="text-gray-400 text-sm">No poster</span>
          </div>
        )}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {movie.vote_average > 0 && (
            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold">
              <span className={getRatingColor(movie.vote_average)}>
                {getRatingPercentage(movie.vote_average)}%
              </span>
            </div>
          )}
          {movie.release_date && (
            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-gray-300">
              <IoCalendarOutline className="inline mr-1" />
              {formatYear(movie.release_date)}
            </div>
          )}
          {movie.adult && (
            <div className="bg-red-600/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white">
              18+
            </div>
          )}
        </div>
        {showIndex && index !== undefined && index < 10 && (
          <div className="absolute top-2 right-2">
            <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              #{index + 1}
            </div>
          </div>
        )}
        {!isHovered && (
          <>
            {isLiked && (
              <div className="absolute bottom-2 left-2">
                <IoHeart className="text-lg text-red-500 drop-shadow-lg" />
              </div>
            )}
            {isSaved && (
              <div className="absolute bottom-2 right-2">
                <IoBookmark className="text-lg text-yellow-500 drop-shadow-lg" />
              </div>
            )}
          </>
        )}
        {isHovered && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black to-transparent">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
              {movie.title || movie.original_title}
            </h3>
            <p className="text-gray-300 text-xs line-clamp-2 mb-2">
              {movie.overview || "No overview available"}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/${movie.id}`}
                className="bg-white text-black p-2 rounded-full hover:bg-white/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <IoPlay className="text-lg" />
              </Link>
              {onLike && (
                <button
                  className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors"
                  onClick={handleLikeClick}
                >
                  {isLiked ? (
                    <IoHeart className="text-lg text-red-500" />
                  ) : (
                    <IoHeartOutline className="text-lg" />
                  )}
                </button>
              )}
              {onSave && (
                <button
                  className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors"
                  onClick={handleSaveClick}
                >
                  {isSaved ? (
                    <IoBookmark className="text-lg text-yellow-500" />
                  ) : (
                    <IoBookmarkOutline className="text-lg" />
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`font-bold ${getRatingColor(movie.vote_average)}`}
              >
                {getRatingPercentage(movie.vote_average)}% Match
              </span>
              <span className="text-gray-400">
                {formatYear(movie.release_date)}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="md:hidden mt-2">
        <p className="text-sm text-gray-300 line-clamp-1">
          {movie.title || movie.original_title}
        </p>
        <p className="text-xs text-gray-500">
          {formatYear(movie.release_date)}
        </p>
      </div>
    </div>
  );
}