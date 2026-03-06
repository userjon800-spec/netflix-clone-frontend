import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  IoChevronForward,
  IoChevronBack,
  IoPlay,
  IoAdd,
  IoThumbsUp,
  IoChevronDown,
  IoStar,
  IoCalendarOutline,
  IoFilmOutline,
} from "react-icons/io5";
import Loading from "./loading";
interface Movie {
  id: number;
  title: string;
  original_title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  media_type?: string;
}
export default function TopRated() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [selectedGenre, _] = useState<string>("all");
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://api.themoviedb.org/3/movie/top_rated?api_key=45b668b102b231b5c4b6bc26aad2da2e&language=en-US&page=1",
        );
        setTopRated(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const getRatingPercentage = (rating: number) => {
    return Math.round(rating * 10);
  };
  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "text-yellow-400";
    if (rating >= 8) return "text-green-500";
    if (rating >= 7) return "text-blue-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };
  const filteredMovies =
    selectedGenre === "all"
      ? topRated
      : topRated.filter((movie) =>
          movie.genre_ids.includes(parseInt(selectedGenre)),
        );
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
        {showControls && filteredMovies.length > 5 && (
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
          {filteredMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="relative min-w-50 h-75 group/movie transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer"
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
                <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent opacity-0 group-hover/movie:opacity-100 transition-opacity duration-300"></div>
                {index < 3 && (
                  <div
                    className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                          ? "bg-gray-400 text-black"
                          : "bg-amber-700 text-white"
                    }`}
                  >
                    #{index + 1}
                  </div>
                )}
                <div
                  className={`absolute top-2 right-2 flex items-center gap-1 text-sm font-bold px-2 py-1 rounded bg-black/60 backdrop-blur-sm ${getRatingColor(movie.vote_average)}`}
                >
                  <IoStar className="text-yellow-400 text-xs" />
                  {movie.vote_average.toFixed(1)}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-gray-300 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                  <IoCalendarOutline />
                  {formatDate(movie.release_date)}
                </div>
                {hoveredMovie === movie.id && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black via-black/90 to-transparent">
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
                      <button className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors">
                        <IoThumbsUp className="text-lg" />
                      </button>
                      <button className="bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/70 transition-colors ml-auto">
                        <IoChevronDown className="text-lg" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`font-bold ${getRatingColor(movie.vote_average)}`}
                      >
                        {getRatingPercentage(movie.vote_average)}% Match
                      </span>
                      <span className="text-gray-300">
                        {formatDate(movie.release_date)}
                      </span>
                      {!movie.adult && (
                        <span className="border border-gray-500 px-1 text-[10px] text-gray-300">
                          13+
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {movie.overview}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <IoFilmOutline />
          <span>{filteredMovies.length} movies</span>
        </div>
        <div className="flex items-center gap-1">
          <IoStar className="text-yellow-400" />
          <span>
            Avg:{" "}
            {(
              filteredMovies.reduce(
                (acc, movie) => acc + movie.vote_average,
                0,
              ) / filteredMovies.length
            ).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}