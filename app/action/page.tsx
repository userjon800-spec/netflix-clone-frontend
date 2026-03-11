"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import { Movie } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import {
  IoFlashOutline,
  IoHeartOutline,
  IoBookmarkOutline,
  IoFilterOutline,
} from "react-icons/io5";
import { BASE_URL } from "@/utils";
export default function ActionPage() {
  const [action, setAction] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("popularity");
  useEffect(() => {
    const fetchActionMovies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/user-api`, {
          withCredentials: true,
        });
        const results = data.actionJSON?.results || [];
        setAction(results);
      } catch (error) {
        console.error("Error fetching action movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActionMovies();
  }, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    Promise.all([
      axios.get(`${BASE_URL}/api/user-liked/${userId}`, {
        withCredentials: true,
      }),
      axios.get(`${BASE_URL}/api/user-saved/${userId}`, {
        withCredentials: true,
      }),
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
        `${BASE_URL}/api/liked-movie`,
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
        `${BASE_URL}/api/saved-movie`,
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
      await axios.delete(`${BASE_URL}/api/un-liked-movie/${movieId}`, {
        data: { userId },
        withCredentials: true,
      });
      setLikedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnsave = async (movieId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      await axios.delete(`${BASE_URL}/api/un-saved-movie/${movieId}`, {
        data: { userId },
        withCredentials: true,
      });
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };
  const sortedMovies = [...action].sort((a, b) => {
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
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
              <IoFlashOutline className="text-red-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Action Movies
              </h1>
              <p className="text-gray-400">
                {action.length} movies • High-octane, thrilling,
                adrenaline-pumping
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <IoFilterOutline className="text-gray-400" />
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md border border-gray-700 focus:border-red-600 focus:outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="text-sm text-gray-400">
              Page 1 of {Math.ceil(action.length / 20)}
            </div>
          </div>
        </div>
        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
              <IoFlashOutline className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl text-gray-300 font-medium mb-2">
              No action movies found
            </h3>
            <p className="text-gray-500">Check back later for new releases</p>
          </div>
        )}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <IoFlashOutline className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">High Octane</h3>
            <p className="text-sm text-gray-400">
              Non-stop action sequences that keep you on the edge of your seat
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <IoHeartOutline className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Top Rated</h3>
            <p className="text-sm text-gray-400">
              Highest rated action movies from around the world
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <IoBookmarkOutline className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">New Releases</h3>
            <p className="text-sm text-gray-400">
              Latest action movies added to our collection
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Popular in Action</h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Dwayne Johnson",
              "Jason Statham",
              "Tom Cruise",
              "Keanu Reeves",
              "Scarlett Johansson",
              "Chris Hemsworth",
            ].map((star) => (
              <button
                key={star}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
              >
                {star}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Action Sub-genres</h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Martial Arts",
              "Superhero",
              "Spy",
              "Disaster",
              "War",
              "Western",
              "Crime Action",
              "Sci-Fi Action",
            ].map((genre) => (
              <button
                key={genre}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}