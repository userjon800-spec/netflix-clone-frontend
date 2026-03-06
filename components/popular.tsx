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
  IoTrendingUp,
  IoTimeOutline,
  IoStarOutline,
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
}
export default function Popular() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?api_key=45b668b102b231b5c4b6bc26aad2da2e&language=en-US&page=1",
        );
        setPopular(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const formatPopularity = (pop: number) => {
    if (pop > 1000) return `${(pop / 1000).toFixed(1)}K`;
    return Math.round(pop).toString();
  };
  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };
  if (loading) return <Loading />;
  return (
    <div className="px-16 py-8 max-md:px-4 relative group max-w-380">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-full">
            <IoTrendingUp className="text-white text-xl" />
          </div>
          <h2 className="text-white text-2xl font-bold">Popular Now</h2>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
            Weekly Top 20
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <IoTimeOutline />
            <span>Updated daily</span>
          </div>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="flex items-center gap-1">
            <IoStarOutline />
            <span>{popular.length} movies</span>
          </div>
        </div>
      </div>
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {showControls && popular.length > 5 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <IoChevronBack className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
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
          {popular.map((movie, index) => (
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

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  <IoTrendingUp className="text-red-500 text-xs" />
                  <span>{formatPopularity(movie.popularity)}</span>
                </div>
                <div
                  className={`absolute top-2 right-2 flex items-center gap-1 text-sm font-bold px-2 py-1 rounded bg-black/60 backdrop-blur-sm ${getRatingColor(movie.vote_average)}`}
                >
                  <IoStarOutline className="text-yellow-400 text-xs" />
                  {movie.vote_average.toFixed(1)}
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-xs text-gray-300 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                    {formatDate(movie.release_date)}
                  </span>
                  {movie.vote_count > 1000 && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-medium">
                      HD
                    </span>
                  )}
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
                        {Math.round(movie.vote_average * 10)}% Match
                      </span>
                      <span className="text-gray-300">
                        {formatDate(movie.release_date)}
                      </span>
                      {!movie.adult && (
                        <span className="border border-gray-500 px-1 text-[10px] text-gray-300">
                          13+
                        </span>
                      )}
                      <span className="text-gray-400">
                        {formatPopularity(movie.popularity)} views
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {movie.overview}
                    </p>
                  </div>
                )}
              </div>
              {index < 3 && (
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    index === 0
                      ? "bg-yellow-500 border-yellow-300 text-black"
                      : index === 1
                        ? "bg-gray-400 border-gray-300 text-black"
                        : "bg-amber-700 border-amber-600 text-white"
                  }`}
                >
                  #{index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>High rating (7.5+)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span>Good rating (6.0-7.4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Average (below 6.0)</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <IoTrendingUp className="text-red-500" />
          <span>Popularity score</span>
        </div>
      </div>
    </div>
  );
}