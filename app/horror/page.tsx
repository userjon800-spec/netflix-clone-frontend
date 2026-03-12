"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import { Movie } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import {
  IoSkullOutline,
  IoFilterOutline,
  IoMoonOutline,
  IoWarningOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import {
  FaDragon,
  FaSpider,
  FaWolfPackBattalion,
} from "react-icons/fa";
import { GiFemaleVampire } from "react-icons/gi";
import { BASE_URL } from "@/utils";
export default function HorrorPage() {
  const [horror, setHorror] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("popularity");
  useEffect(() => {
    const fetchHorrorMovies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/user-api`, {
          withCredentials: true,
        });
        const results = data.horrorJSON?.results || [];
        setHorror(results);
      } catch (error) {
        console.error("Error fetching horror movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHorrorMovies();
  }, []);
  useEffect(() => {
     const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return;
    Promise.all([
      axios.get(`${BASE_URL}/api/user-liked/${userId}`,{
        withCredentials: true,
      }),
      axios.get(`${BASE_URL}/api/user-saved/${userId}`,{
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
     const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
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
     const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
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
     const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/un-liked-movie/${movieId}`,
        { data: { userId }, withCredentials: true },
      );
      setLikedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnsave = async (movieId: number) => {
     const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/un-saved-movie/${movieId}`,
        { data: { userId }, withCredentials: true },
      );
      setSavedMovies((prev) => prev.filter((id) => id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };
  const sortedMovies = [...horror].sort((a, b) => {
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
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
              <IoSkullOutline className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Horror Movies
              </h1>
              <p className="text-gray-400">
                {horror.length} movies • Face your fears with the scariest films
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <IoWarningOutline className="text-purple-500" />
              <span>
                Classics:{" "}
                {
                  horror.filter(
                    (m) => new Date(m.release_date).getFullYear() < 2000,
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <IoMoonOutline className="text-purple-500" />
              <span>
                Modern:{" "}
                {
                  horror.filter(
                    (m) => new Date(m.release_date).getFullYear() >= 2000,
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
                className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md border border-gray-700 focus:border-purple-600 focus:outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div className="text-sm text-gray-400">
              Page 1 of {Math.ceil(horror.length / 20)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-purple-600/10 to-transparent rounded-lg p-4 border border-purple-600/20">
            <GiFemaleVampire className="text-purple-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Classic Monsters</h3>
            <p className="text-xs text-gray-400">
              Dracula, Frankenstein & more
            </p>
          </div>
          <div className="bg-linear-to-br from-purple-600/10 to-transparent rounded-lg p-4 border border-purple-600/20">
            <FaWolfPackBattalion className="text-purple-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Creature Features</h3>
            <p className="text-xs text-gray-400">Werewolves, beasts & beyond</p>
          </div>
          <div className="bg-linear-to-br from-purple-600/10 to-transparent rounded-lg p-4 border border-purple-600/20">
            <FaSpider className="text-purple-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Creepy Crawlies</h3>
            <p className="text-xs text-gray-400">Spiders, insects & phobias</p>
          </div>
          <div className="bg-linear-to-br from-purple-600/10 to-transparent rounded-lg p-4 border border-purple-600/20">
            <FaDragon className="text-purple-500 text-2xl mb-2" />
            <h3 className="font-semibold text-sm">Mythical Horrors</h3>
            <p className="text-xs text-gray-400">Legends come to life</p>
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
              <IoSkullOutline className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl text-gray-300 font-medium mb-2">
              No horror movies found
            </h3>
            <p className="text-gray-500">
              Check back later for more nightmares
            </p>
          </div>
        )}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <IoPeopleOutline className="text-purple-500" />
            Masters of Horror
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Stephen King",
              "John Carpenter",
              "Wes Craven",
              "George A. Romero",
              "Dario Argento",
              "Mike Flanagan",
              "James Wan",
              "Jordan Peele",
              "Ari Aster",
              "Robert Eggers",
            ].map((director) => (
              <button
                key={director}
                className="px-4 py-2 bg-gray-800/50 hover:bg-purple-600/20 rounded-full text-sm text-gray-300 hover:text-purple-400 transition-colors border border-gray-700 hover:border-purple-600"
              >
                {director}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">
            Horror Through the Ages
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Classic (1920s-50s)",
              "Hammer Horror (1960s)",
              "Slasher Era (1970s-80s)",
              "Scream (1990s)",
              "Torture Porn (2000s)",
              "Elevated Horror (2010s-present)",
            ].map((era) => (
              <button
                key={era}
                className="px-4 py-2 bg-gray-800/50 hover:bg-purple-600/20 rounded-full text-sm text-gray-300 hover:text-purple-400 transition-colors border border-gray-700 hover:border-purple-600"
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