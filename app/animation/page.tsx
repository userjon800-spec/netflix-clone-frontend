"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import { Movie } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { IoFilterOutline, IoRocketOutline } from "react-icons/io5";
import { GiFilmProjector } from "react-icons/gi";
export default function AnimationPage() {
  const [animation, setAnimation] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("popularity");
  useEffect(() => {
    const fetchAnimationMovies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:7800/api/user-api`, {
          withCredentials: true,
        });
        const results = data.animationJSON?.results || [];
        setAnimation(results);
      } catch (error) {
        console.error("Error fetching animation movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimationMovies();
  }, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    Promise.all([
      axios.get(`http://localhost:7800/api/user-liked/${userId}`),
      axios.get(`http://localhost:7800/api/user-saved/${userId}`),
    ])
      .then(([likedRes, savedRes]) => {
        setLikedMovies(likedRes.data.map((item: any) => item.movieId));
        setSavedMovies(savedRes.data.map((item: any) => item.movieId));
      })
      .catch((err) => console.error(err));
  }, []);
  const handleLike = async (movie: Movie) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      await axios.post(
        "http://localhost:7800/api/liked-movie",
        { ...movie, userId },
        { withCredentials: true },
      );
      setLikedMovies((prev) => [...prev, movie.id]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async (movie: Movie) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      await axios.post(
        "http://localhost:7800/api/saved-movie",
        { ...movie, userId },
        { withCredentials: true },
      );
      setSavedMovies((prev) => [...prev, movie.id]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnlike = async (movieId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      await axios.delete(
        `http://localhost:7800/api/un-liked-movie/${movieId}`,
        { data: { userId }, withCredentials: true },
      );
      setLikedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnsave = async (movieId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      await axios.delete(
        `http://localhost:7800/api/un-saved-movie/${movieId}`,
        { data: { userId }, withCredentials: true },
      );
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };
  const sortedMovies = [...animation].sort((a, b) => {
    if (sortBy === "popularity") return b.popularity - a.popularity;
    if (sortBy === "rating") return b.vote_average - a.vote_average;
    if (sortBy === "year") {
      return (
        new Date(b.release_date).getFullYear() -
        new Date(a.release_date).getFullYear()
      );
    }
    return 0;
  });
  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <GiFilmProjector className="text-blue-500 text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Animation
              </h1>
              <p className="text-gray-400 text-sm">
                {animation.length} animated films for all ages
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <IoFilterOutline className="text-gray-500 text-sm" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="popularity">Popular</option>
                <option value="rating">Top Rated</option>
                <option value="year">Newest</option>
              </select>
            </div>
            <div className="text-xs text-gray-600">
              {animation.length} titles
            </div>
          </div>
        </div>
        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isLiked={likedMovies.includes(movie.id)}
                isSaved={savedMovies.includes(movie.id)}
                onLike={handleLike}
                onSave={handleSave}
                onUnlike={handleUnlike}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <IoRocketOutline className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No animation movies found</p>
          </div>
        )}
        <div className="mt-10">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Age Groups</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Kids (0-6)",
              "Children (7-12)",
              "Teens (13-17)",
              "Family",
              "Adults",
            ].map((age) => (
              <button
                key={age}
                className="px-3 py-1 bg-gray-800/30 hover:bg-blue-500/10 rounded text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                {age}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3">
            Animation Studios
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Studio Ghibli",
              "Walt Disney",
              "Pixar",
              "DreamWorks",
              "Illumination",
              "Sony Pictures Animation",
              "Blue Sky",
              "Laika",
            ].map((studio) => (
              <button
                key={studio}
                className="px-3 py-1 bg-gray-800/30 hover:bg-blue-500/10 rounded text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                {studio}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}