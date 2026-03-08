"use client";
import MenuBar from "@/components/menu-bar";
import { User } from "@/types";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  IoPersonCircle,
  IoSaveOutline,
  IoHeartOutline,
  IoKeyOutline,
  IoCameraOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoFilmOutline,
  IoBookmark,
} from "react-icons/io5";
export default function ProfilePage() {
  const [user, setUser] = useState<User>();
  const [activeTab, setActiveTab] = useState("profile");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [likedMovies, setLikedMovies] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const id = localStorage.getItem("userId");
    axios
      .get(`http://localhost:7800/api/user/${id}`, { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:7800/api/user-liked", { withCredentials: true })
      .then(({ data }) => setLikedMovies(data))
      .catch((err) => console.error(err));
    axios
      .get("http://localhost:7800/api/user-saved", { withCredentials: true })
      .then(({ data }) => setSavedMovies(data))
      .catch((err) => console.error(err));
  }, []);
  const onReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datas = new FormData(e.currentTarget);
    const resetCode = datas.get("reset-code") as string;
    if (resetCode.length < 6) {
      toast.error("Reset code must be at least 6 digits");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:7800/api/reset-pass",
        {
          resetPass: resetCode,
          id: localStorage.getItem("userId"),
        },
        { withCredentials: true },
      );
      toast.success(data.message || "Password reset successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...resetCode];
      newCode[index] = value;
      setResetCode(newCode);
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  const tabs = [
    { id: "profile", name: "Profile", icon: IoPersonCircle },
    { id: "saved", name: "Saved Movies", icon: IoSaveOutline },
    { id: "liked", name: "Liked Movies", icon: IoHeartOutline },
    { id: "security", name: "Security", icon: IoKeyOutline },
  ];
  const update = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const reset = await axios.put("http://localhost:7800/api/user-update", {
        name: formData.get("name"),
        email: formData.get("email"),
        id: localStorage.getItem("userId"),
      });
      if (reset.status === 202) {
        toast.success(reset.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Nimadir xato ketdi");
    }
  };
  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      return toast.error("Yangi parolni to'g'ri kiriting");
    }
    try {
      const reset = await axios.put("http://localhost:7800/api/user-pass", {
        oldPass: formData.get("currentPassword"),
        newPass: formData.get("newPassword"),
        id: localStorage.getItem("userId"),
      });
      if (reset.status === 202) {
        toast.success(reset.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Nimadir xato ketdi");
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-380 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
              <IoCameraOutline className="text-white text-lg" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {user?.name}
            </h1>
            <p className="text-gray-400 mb-4">{user?.email}</p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-300">
                <IoFilmOutline />
                <span>{savedMovies.length} Saved</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <IoHeartOutline />
                <span>{likedMovies.length} Liked</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <IoTimeOutline />
                <span>Member since 2024</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
        <div className="border-b border-gray-800 mb-8 overflow-x-auto">
          <div className="flex gap-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-red-600 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="text-xl" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-6">
                <form action="" method="POST" onSubmit={update}>
                  <h3 className="text-xl font-semibold mb-4">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="text-sm text-gray-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        name="name"
                        id="name"
                        disabled={!isEditing}
                        className="w-full mt-1 px-4 py-3 bg-gray-800 rounded-md text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm text-gray-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={user?.email}
                        disabled={!isEditing}
                        className="w-full mt-1 px-4 py-3 bg-gray-800 rounded-md text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
          {activeTab === "saved" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Saved Movies</h3>
              {savedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {savedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer relative"
                    >
                      <div className="relative aspect-2/3 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {/* Rating Badge */}
                          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold">
                            <span
                              className={
                                movie.vote_average >= 7
                                  ? "text-green-500"
                                  : movie.vote_average >= 5
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }
                            >
                              {Math.round(movie.vote_average * 10)}%
                            </span>
                          </div>
                          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-gray-300">
                            {new Date(movie.release_date).getFullYear()}
                          </div>
                          {movie.adult && (
                            <div className="bg-red-600/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white">
                              18+
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-yellow-500/20 backdrop-blur-sm p-1.5 rounded-full">
                            <IoBookmark className="text-yellow-500 text-lg" />
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                            {movie.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-300">
                              {movie.original_language?.toUpperCase()}
                            </span>
                            <span className="text-gray-400">
                              {Math.round(movie.popularity)} views
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="flex-1 bg-white text-black text-xs py-1.5 rounded font-medium hover:bg-white/90 transition-colors">
                              Play
                            </button>
                            <button
                              className="p-1.5 bg-gray-800/80 rounded hover:bg-gray-700 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <IoBookmark className="text-yellow-500 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-300 line-clamp-1 md:hidden">
                        {movie.title}
                      </p>
                      <div className="flex items-center justify-between md:hidden">
                        <p className="text-xs text-gray-500">
                          {new Date(movie.release_date).getFullYear()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(movie.vote_average * 10)}% Match
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
                    <IoBookmark className="text-4xl text-gray-600" />
                  </div>
                  <h4 className="text-xl text-gray-300 font-medium mb-2">
                    No saved movies yet
                  </h4>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Movies you save will appear here. Click the bookmark icon on
                    any movie to add it to your list!
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "liked" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Liked Movies</h3>
              {likedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {likedMovies.map((movie) => (
                    <div
                      key={movie._id}
                      className="group cursor-pointer relative"
                    >
                      <div className="relative aspect-2/3 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          width={500}
                          height={100}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold">
                            <span
                              className={
                                movie.vote_average >= 7
                                  ? "text-green-500"
                                  : movie.vote_average >= 5
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }
                            >
                              {Math.round(movie.vote_average * 10)}%
                            </span>
                          </div>
                          {movie.adult && (
                            <div className="bg-red-600/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white">
                              18+
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-500/20 backdrop-blur-sm p-1.5 rounded-full">
                            <IoHeartOutline className="text-red-500 text-lg" />
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                            {movie.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                            <span className="text-gray-400">
                              {Math.round(movie.popularity)} views
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button className="flex-1 bg-white text-black text-xs py-1.5 rounded font-medium hover:bg-white/90 transition-colors">
                              Play
                            </button>
                            <button className="p-1.5 bg-gray-800/80 rounded hover:bg-gray-700 transition-colors">
                              <IoHeartOutline className="text-white text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-300 line-clamp-1 md:hidden">
                        {movie.title}
                      </p>
                      <p className="text-xs text-gray-500 md:hidden">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
                    <IoHeartOutline className="text-4xl text-gray-600" />
                  </div>
                  <h4 className="text-xl text-gray-300 font-medium mb-2">
                    No liked movies yet
                  </h4>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Movies you like will appear here. Start exploring and like
                    your favorite movies!
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "security" && (
            <div className="space-y-6">
              {!user?.resetPass && (
                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">Reset Password</h3>
                  <form onSubmit={onReset} className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Enter 6-digit reset code
                      </label>
                      <div className="flex gap-2 justify-between">
                        {resetCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleCodeChange(index, e.target.value)
                            }
                            className="w-12 h-12 text-center bg-gray-800 rounded-md text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        ))}
                      </div>
                      <input
                        type="hidden"
                        name="reset-code"
                        value={resetCode.join("")}
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <IoCheckmarkCircle className="text-green-500" />
                        Code must be exactly 6 digits
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                      Reset Password
                    </button>
                  </form>
                </div>
              )}
              <div className="bg-gray-900/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                <form onSubmit={updatePassword} className="max-w-md space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="current-password"
                      id="current-password"
                      className="text-sm text-gray-300 block"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="currentPassword"
                        id="current-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="text-sm text-gray-300 block"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        id="new-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="text-sm text-gray-300 block"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirm-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-md space-y-2">
                    <p className="text-sm text-gray-300">
                      Password requirements:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                      <li>At least 6 characters long</li>
                      <li>Include at least one number</li>
                      <li>Include at least one uppercase letter</li>
                      <li>Include at least one lowercase letter</li>
                    </ul>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </form>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-300">
                      Two-factor authentication
                    </span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-red-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-300">Login notifications</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-red-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}