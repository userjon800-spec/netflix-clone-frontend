"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import { Movie } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import {
  IoHappyOutline,
  IoFilterOutline,
  IoTicketOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { FaLaughSquint, FaTheaterMasks } from "react-icons/fa";
export default function ComedyPage() {
  const [comedy, setComedy] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("popularity");
  useEffect(() => {
    const fetchComedyMovies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:7800/api/user-api`, {
          withCredentials: true,
        });
        const results = data.comedyJSON?.results || [];
        setComedy(results);
      } catch (error) {
        console.error("Error fetching comedy movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComedyMovies();
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
  const sortedMovies = [...comedy].sort((a, b) => {
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
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <IoHappyOutline className="text-yellow-500 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Comedy Movies
              </h1>
              <p className="text-gray-400">
                {comedy.length} movies • Laugh out loud with the best comedies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <FaLaughSquint className="text-yellow-500" />
              <span>
                Top Rated: {comedy.filter((m) => m.vote_average > 7).length}{" "}
                movies
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <IoTimeOutline className="text-yellow-500" />
              <span>
                New this year:{" "}
                {
                  comedy.filter(
                    (m) => new Date(m.release_date).getFullYear() > 2023,
                  ).length
                }
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <IoFilterOutline className="text-gray-400" />
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md border border-gray-700 focus:border-yellow-500 focus:outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="text-sm text-gray-400">
              Page 1 of {Math.ceil(comedy.length / 20)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-yellow-500/10 to-transparent rounded-lg p-4 border border-yellow-500/20">
            <IoTicketOutline className="text-yellow-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Box Office Hits</h3>
            <p className="text-xs text-gray-400">Top grossing comedies</p>
          </div>
          <div className="bg-linear-to-br from-yellow-500/10 to-transparent rounded-lg p-4 border border-yellow-500/20">
            <IoPeopleOutline className="text-yellow-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Comedy Legends</h3>
            <p className="text-xs text-gray-400">Classic performances</p>
          </div>
          <div className="bg-linear-to-br from-yellow-500/10 to-transparent rounded-lg p-4 border border-yellow-500/20">
            <IoStarOutline className="text-yellow-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Critics Choice</h3>
            <p className="text-xs text-gray-400">Award winners</p>
          </div>
          <div className="bg-linear-to-br from-yellow-500/10 to-transparent rounded-lg p-4 border border-yellow-500/20">
            <IoTimeOutline className="text-yellow-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Timeless Classics</h3>
            <p className="text-xs text-gray-400">Aged like fine wine</p>
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
                layout="grid"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
              <IoHappyOutline className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl text-gray-300 font-medium mb-2">
              No comedy movies found
            </h3>
            <p className="text-gray-500">Check back later for new releases</p>
          </div>
        )}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <IoPeopleOutline className="text-yellow-500" />
            Popular Comedy Actors
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Kevin Hart",
              "Melissa McCarthy",
              "Jim Carrey",
              "Tiffany Haddish",
              "Adam Sandler",
              "Rebel Wilson",
              "Will Ferrell",
              "Amy Schumer",
              "Eddie Murphy",
              "Sarah Silverman",
            ].map((actor) => (
              <button
                key={actor}
                className="px-4 py-2 bg-gray-800/50 hover:bg-yellow-500/20 rounded-full text-sm text-gray-300 hover:text-yellow-500 transition-colors border border-gray-700 hover:border-yellow-500"
              >
                {actor}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Comedy by Era</h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Classic (1950s-70s)",
              "80s Comedy",
              "90s Comedy",
              "2000s Comedy",
              "2010s Comedy",
              "2020s Comedy",
            ].map((era) => (
              <button
                key={era}
                className="px-4 py-2 bg-gray-800/50 hover:bg-yellow-500/20 rounded-full text-sm text-gray-300 hover:text-yellow-500 transition-colors border border-gray-700 hover:border-yellow-500"
              >
                {era}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}