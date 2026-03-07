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
      .catch((err) => console.log(err));
    // Mock data for saved and liked movies
    setSavedMovies([
      {
        id: 1,
        title: "Inception",
        year: 2010,
        poster: "/posters/inception.jpg",
      },
      {
        id: 2,
        title: "The Dark Knight",
        year: 2008,
        poster: "/posters/dark-knight.jpg",
      },
      {
        id: 3,
        title: "Interstellar",
        year: 2014,
        poster: "/posters/interstellar.jpg",
      },
    ]);

    setLikedMovies([
      { id: 4, title: "The Matrix", year: 1999, poster: "/posters/matrix.jpg" },
      {
        id: 5,
        title: "Pulp Fiction",
        year: 1994,
        poster: "/posters/pulp-fiction.jpg",
      },
    ]);
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
      // Auto-focus next input
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
      {/* Main Content */}
      <div className="max-w-380 mx-auto px-4 md:px-8 pt-24 pb-16">
        {/* Profile Header */}
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
        {/* Tabs Navigation */}
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
        {/* Tab Content */}
        <div className="mt-8">
          {/* Profile Tab */}
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
          {/* Saved Movies Tab */}
          {activeTab === "saved" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Saved Movies</h3>
              {savedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {savedMovies.map((movie) => (
                    <div key={movie.id} className="group cursor-pointer">
                      <div className="relative aspect-2/3 bg-gray-800 rounded-md overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-sm font-medium">
                            {movie.title}
                          </p>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  No saved movies yet
                </p>
              )}
            </div>
          )}
          {/* Liked Movies Tab */}
          {activeTab === "liked" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Liked Movies</h3>
              {likedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {likedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer relative"
                    >
                      <div className="relative aspect-2/3 bg-gray-800 rounded-md overflow-hidden">
                        <div className="absolute top-2 right-2 text-red-500">
                          <IoHeartOutline className="text-xl" />
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-sm font-medium">
                            {movie.title}
                          </p>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  No liked movies yet
                </p>
              )}
            </div>
          )}
          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Reset Password Section (faqat resetPass bo'lmasa) */}
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
              {/* Change Password Section - Yangi qo'shilgan qism */}
              <div className="bg-gray-900/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                <form onSubmit={updatePassword} className="max-w-md space-y-5">
                  {/* Current Password */}
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
                  {/* New Password */}
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
                  {/* Confirm New Password */}
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
                  {/* Password Requirements */}
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
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </form>
              </div>
              {/* Security Settings */}
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