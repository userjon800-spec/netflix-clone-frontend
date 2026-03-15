"use client";
import MenuBar from "@/components/menu-bar";
import MovieCard from "@/components/movie-card";
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
  IoLockOpenOutline,
} from "react-icons/io5";
import { UploadButton } from "@/utils/uploadthing";
import { BASE_URL } from "@/utils";
export default function ProfilePage() {
  const [user, setUser] = useState<User>();
  const [activeTab, setActiveTab] = useState("profile");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [likedMovies, setLikedMovies] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAvatar, setUpdatedAvatar] = useState(false);
   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    axios
      .get(`${BASE_URL}/api/user/${id}`, { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch((err) => console.error(err));
  }, [updatedAvatar]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user-liked/${userId}`, {
        withCredentials: true,
      })
      .then(({ data }) => setLikedMovies(data))
      .catch((err) => console.error(err));
    axios
      .get(`${BASE_URL}/api/user-saved/${userId}`, {
        withCredentials: true,
      })
      .then(({ data }) => setSavedMovies(data))
      .catch((err) => console.error(err));
  }, [userId]);
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
        `${BASE_URL}/api/reset-pass`,
        {
          resetPass: resetCode,
          id: typeof window !== "undefined" ? localStorage.getItem("userId") : null
        },
        { withCredentials: true },
      );
      toast.success(data.message || "Password reset successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to reset password");
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
      const reset = await axios.put(
        `${BASE_URL}/api/user-update`,
        {
          name: formData.get("name"),
          email: formData.get("email"),
          id: typeof window !== "undefined" ? localStorage.getItem("userId") : null
        },
        { withCredentials: true },
      );
      if (reset.status === 202) {
        toast.success(reset.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || "Nimadir xato ketdi");
    }
  };
  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      return toast.error("Yangi parolni to'g'ri kiriting");
    }
    try {
      const reset = await axios.put(
        `${BASE_URL}/api/user-pass`,
        {
          oldPass: formData.get("currentPassword"),
          newPass: formData.get("newPassword"),
          id: typeof window !== "undefined" ? localStorage.getItem("userId") : null
        },
        { withCredentials: true },
      );
      if (reset.status === 202) {
        toast.success(reset.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || "Nimadir xato ketdi");
    }
  };
  const handleSetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("password") !== formData.get("confirm-password")) {
      toast.error("Parollarni to'g'ri kiriting");
    }
    try {
      const data = await axios.put(
        `${BASE_URL}/api/user-set-pass/${userId}`,
        { password: formData.get("password") },
        { withCredentials: true },
      );
      if (data.status === 200) {
        toast.success(data.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || "Nimadir xato ketdi");
    }
  };
  // Like va Save funksiyalari
  const handleLike = async (movie: any) => {
    // Like qilish funksiyasi
  };
  const handleUnlike = async (movieId: number) => {
    // Likeni olib tashlash
  };
  const handleSave = async (movie: any) => {
    // Save qilish
  };
  const handleUnsave = async (movieId: number) => {
    // Saveni olib tashlash
  };
  return (
    <div className="min-h-screen border border-black bg-black text-white">
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
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0">
              <div className="relative">
                <button className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors z-10 relative">
                  <IoCameraOutline className="text-white text-lg" />
                </button>
                <UploadButton
                  className="absolute w-33 h-33 cursor-pointer -top-23.5 -left-23.5 rounded-2xl opacity-0 z-50"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res[0].ufsUrl;
                    axios
                      .put(
                        `${BASE_URL}/api/user-avatar`,
                        { url },
                        { withCredentials: true },
                      )
                      .then((res) => {
                        if (res.status === 200) {
                          toast.success(res.data.message);
                          setTimeout(() => window.location.reload(), 1500);
                          setUpdatedAvatar(true);
                        }
                      })
                      .catch((err) => console.error(`ERROR! ${err.message}`));
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`);
                  }}
                />
              </div>
            </div>
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
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isLiked={false}
                      isSaved={true}
                      onLike={handleLike}
                      onSave={handleSave}
                      onUnlike={handleUnlike}
                      onUnsave={handleUnsave}
                      layout="grid"
                    />
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
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isLiked={true}
                      isSaved={false}
                      onLike={handleLike}
                      onSave={handleSave}
                      onUnlike={handleUnlike}
                      onUnsave={handleUnsave}
                      layout="grid"
                    />
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
              {!user?.password && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-yellow-600/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center">
                      <IoLockOpenOutline className="text-yellow-500 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Set Password
                    </h3>
                  </div>
                  <form
                    onSubmit={handleSetPassword}
                    className="max-w-md space-y-5"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="new-password"
                        className="text-sm text-gray-300 block"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-yellow-500 focus:outline-none transition-colors"
                        placeholder="Enter new password"
                        required
                        name="password"
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="confirm-password"
                        className="text-sm text-gray-300 block"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-yellow-500 focus:outline-none transition-colors"
                        placeholder="Confirm new password"
                        required
                        name="confirm-password"
                        minLength={6}
                      />
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
                      className="w-full px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
                    >
                      Set Password
                    </button>
                  </form>
                </div>
              )}
              {!user?.resetPass && user?.password && (
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
              {user?.password && (
                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">
                    Change Password
                  </h3>
                  <form
                    onSubmit={updatePassword}
                    className="max-w-md space-y-5"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="current-password"
                        className="text-sm text-gray-300 block"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="current-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="new-password"
                        className="text-sm text-gray-300 block"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="new-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="confirm-password"
                        className="text-sm text-gray-300 block"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirm-password"
                        className="w-full h-12 px-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
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
              )}
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