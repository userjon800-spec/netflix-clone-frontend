import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  IoChevronForward,
  IoChevronBack,
  IoPlay,
  IoAdd,
  IoChevronDown,
} from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Loading from "./loading";
import { Movie } from "@/types";
interface LikedMovie {
  id: number;
  userId?: string;
  movieId: number;
}
export default function Trending() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/day?api_key=45b668b102b231b5c4b6bc26aad2da2e",
        );
        setTrending(data.results || []);
        const userId = localStorage.getItem("userId");
        if (userId) {
          const likedResponse = await axios.get(
            `http://localhost:7800/api/liked-movies/${userId}`,
            { withCredentials: true },
          );
          const likedIds = likedResponse.data.map(
            (item: LikedMovie) => item.movieId,
          );
          setLikedMovies(likedIds);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const getRatingPercentage = (rating: number) => {
    return Math.round(rating * 10);
  };
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };
  const onReaction = async (movie: Movie) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        return;
      }
      const movieData = {
        ...movie,
        userId: userId,
      };
      const response = await axios.post(
        "http://localhost:7800/api/liked-movie",
        movieData,
        { withCredentials: true },
      );
      if (response.status === 200) {
        setLikedMovies((prev) => [...prev, movie.id]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const unLike = async (movieId: number) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const response = await axios.delete(
        `http://localhost:7800/api/un-liked-movie/${movieId}`,
        {
          data: { userId },
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        setLikedMovies((prev) => prev.filter((id) => id !== movieId));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const isMovieLiked = (movieId: number) => {
    return likedMovies.includes(movieId);
  };
  if (loading) return <Loading />;
  return (
    <div className="px-16 py-8 max-md:px-4 relative group max-w-380 my-5">
      <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
        Trending Now
        <span className="text-sm text-gray-400 font-normal">Updated daily</span>
      </h2>
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3.75 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 -ml-4 cursor-pointer"
          >
            <IoChevronBack className="text-2xl" />
          </button>
        )}
        {showControls && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3.75 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 -mr-4 cursor-pointer"
          >
            <IoChevronForward className="text-2xl" />
          </button>
        )}
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trending.map((movie, index) => (
            <div
              key={movie.id}
              className="relative min-w-50 h-75 group/movie transition-transform duration-300 hover:scale-110 hover:z-20 cursor-pointer"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/movie:scale-110"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover/movie:opacity-100 transition-opacity duration-300"></div>
                {index < 10 && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                )}
                <div
                  className={`absolute top-2 right-2 text-sm font-bold ${getRatingColor(movie.vote_average)}`}
                >
                  {getRatingPercentage(movie.vote_average)}%
                </div>
                {isMovieLiked(movie.id) && (
                  <div className="absolute bottom-2 left-2 text-red-500">
                    <FaHeart className="text-lg" />
                  </div>
                )}
                {hoveredMovie === movie.id && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent">
                    <h3 className="text-white font-bold text-sm mb-2 line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <button className="bg-white text-black p-2 rounded-full hover:bg-white/80 transition-colors">
                        <IoPlay className="text-lg" />
                      </button>
                      <button className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors">
                        <IoAdd className="text-lg" />
                      </button>
                      <button
                        className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isMovieLiked(movie.id)) {
                            unLike(movie.id);
                          } else {
                            onReaction(movie);
                          }
                        }}
                      >
                        {isMovieLiked(movie.id) ? (
                          <FaHeart className="text-lg text-red-500" />
                        ) : (
                          <FaRegHeart className="text-lg" />
                        )}
                      </button>
                      <button className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors ml-auto">
                        <IoChevronDown className="text-lg" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-green-500 font-bold">
                        {getRatingPercentage(movie.vote_average)}% Match
                      </span>
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      {!movie.adult && (
                        <span className="border border-gray-500 px-1 text-[10px]">
                          13+
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[120px] font-black text-gray-800/30 select-none hidden md:block">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}