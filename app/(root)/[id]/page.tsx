"use client";
import MenuBar from "@/components/menu-bar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  IoPlay,
  IoTimeOutline,
  IoCalendarOutline,
  IoStarOutline,
  IoFilmOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { FaImdb } from "react-icons/fa";
import Loading from "@/components/loading";
import { MovieDetails } from "@/types";
import Link from "next/link";
export default function MoviePage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "cast" | "media">(
    "about",
  );
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY_API as string;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`,
        );
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, API_KEY]);
  if (loading) return <Loading />;
  if (!movie) {
    return (
      <div className="min-h-screen bg-black border border-white text-white">
        <MenuBar />
        <div className="flex flex-col items-center justify-center px-4 py-24 min-h-[calc(100vh-80px)]">
          <div className="mb-8 text-8xl animate-bounce">🎬</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Oops! Movie Missing
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
            Looks like this movie has escaped our library. But don't worry, we
            have thousands of other great titles waiting for you!
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Browse Trending
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const trailer =
    movie.videos.results.find(
      (video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.official,
    ) ||
    movie.videos.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    );
  const mainCast = movie.credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 15)
    .filter((member) => member.profile_path);
  const importantCrew = movie.credits.crew
    .filter((member) =>
      [
        "Director",
        "Writer",
        "Screenplay",
        "Producer",
        "Music",
        "Cinematography",
        "Editor",
      ].includes(member.job),
    )
    .slice(0, 12)
    .filter((v, i, a) => a.findIndex((t) => t.job === v.job) === i);
  const posters = movie.images.posters.slice(0, 5);
  const backdrops = movie.images.backdrops.slice(0, 6);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="relative h-[70vh] min-h-150 w-full">
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="hidden md:block w-64 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={256}
                  height={384}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-gray-300 mb-4 italic">
                    {movie.tagline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <IoStarOutline className="text-yellow-500" />
                    <span className="font-bold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({movie.vote_count})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoCalendarOutline />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoTimeOutline />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoFilmOutline />
                    <span>{movie.status}</span>
                  </div>
                  {movie.imdb_id && (
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <FaImdb className="text-2xl" />
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 max-w-3xl mb-6">{movie.overview}</p>
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <IoPlay />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
              <div>salom</div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-800 sticky top-0 bg-black/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "about"
                  ? "border-red-600 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("cast")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "cast"
                  ? "border-red-600 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Cast & Crew
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "media"
                  ? "border-red-600 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Media
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === "about" && (
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Storyline</h2>
              <p className="text-gray-300 mb-8">{movie.overview}</p>
              <h2 className="text-2xl font-bold mb-6">Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Release Date</h3>
                  <p>
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Runtime</h3>
                  <p>{formatRuntime(movie.runtime)}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Budget</h3>
                  <p>{formatCurrency(movie.budget)}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Revenue</h3>
                  <p>{formatCurrency(movie.revenue)}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Status</h3>
                  <p>{movie.status}</p>
                </div>
                {movie.homepage && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Homepage</h3>
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Visit official website
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Key Crew</h2>
              <div className="grid grid-cols-2 gap-6">
                {importantCrew.map((member) => (
                  <div key={`${member.id}-${member.job}`}>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.job}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "cast" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mainCast.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 mb-3">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <IoPeopleOutline className="text-4xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm">{member.name}</h3>
                  <p className="text-xs text-gray-400">{member.character}</p>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold mt-12 mb-6">Crew</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movie.credits.crew.slice(0, 20).map((member) => (
                <div key={`${member.id}-${member.job}`} className="text-sm">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-gray-400"> - {member.job}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "media" && (
          <div>
            {trailer && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Trailer</h2>
                <div className="aspect-video max-w-4xl rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            {posters.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Posters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {posters.map((poster, index) => (
                    <div
                      key={index}
                      className="relative aspect-2/3 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(poster.file_path)}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                        alt={`Poster ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {backdrops.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Backdrops</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {backdrops.map((backdrop, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(backdrop.file_path)}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w780${backdrop.file_path}`}
                        alt={`Backdrop ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <button
                  className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
                  onClick={() => setSelectedImage(null)}
                >
                  x
                </button>
                <div className="relative max-w-6xl max-h-[90vh]">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${selectedImage}`}
                    alt="Full size image"
                    width={1920}
                    height={1080}
                    className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
