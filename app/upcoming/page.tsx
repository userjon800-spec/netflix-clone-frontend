"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { IoCalendarOutline } from "react-icons/io5";
import { Movie } from "@/types";
import { BASE_URL } from "@/utils";
export default function UpcomingPage() {
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/user-api`, {
          withCredentials: true,
        });
        const results = data.upcomingJSON?.results || [];
        setUpcoming(results);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
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
  const handleLike = async (movie: any) => {
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
  const handleSave = async (movie: any) => {
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
  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-black">
      <MenuBar />
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
              <IoCalendarOutline className="text-red-600 text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Upcoming Movies
            </h1>
          </div>
          <p className="text-gray-400 ml-12">
            Discover the latest movies coming to theaters soon
          </p>
        </div>
        {upcoming.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {upcoming.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={index}
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
              <IoCalendarOutline className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl text-gray-300 font-medium mb-2">
              No upcoming movies found
            </h3>
            <p className="text-gray-500">Check back later for new releases</p>
          </div>
        )}
      </div>
    </div>
  );
}