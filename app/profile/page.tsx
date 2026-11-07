"use client";
import MenuBar from "@/components/menu-bar";
import { User } from "@/types";
import axios from "axios";
import { FormEvent, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  IoPersonCircleOutline,
  IoBookmarkOutline,
  IoHeartOutline,
  IoKeyOutline,
  IoCameraOutline,
  IoCalendarOutline,
  IoFilmOutline,
  IoLockOpenOutline,
  IoShieldCheckmarkOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoBarChartOutline,
  IoPlayOutline,
  IoStarOutline,
} from "react-icons/io5";
import { UploadButton } from "@/utils/uploadthing";
import { BASE_URL } from "@/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<User>();
  const [activeTab, setActiveTab] = useState<
    "saved" | "liked" | "info" | "security" | "stats"
  >("saved");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [likedMovies, setLikedMovies] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [updatedAvatar, setUpdatedAvatar] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/signin";
      return;
    }

    axios
      .get(`${BASE_URL}/api/me`, { withCredentials: true })
      .then(({ data }) => {
        if (data.user) {
          setUser(data.user);
          setEditFormData({
            name: data.user.name || "",
            email: data.user.email || "",
          });
          const currentId = data.user._id || data.user.id;
          if (currentId) {
            localStorage.setItem("userId", currentId);
            axios
              .get(`${BASE_URL}/api/user-liked/${currentId}`, {
                withCredentials: true,
              })
              .then((res) => setLikedMovies(res.data || []))
              .catch(console.error);
            axios
              .get(`${BASE_URL}/api/user-saved/${currentId}`, {
                withCredentials: true,
              })
              .then((res) => setSavedMovies(res.data || []))
              .catch(console.error);
          }
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [updatedAvatar]);

  // Handle personal info update
  const handleUpdateInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      const res = await axios.put(`${BASE_URL}/api/user-update`, editFormData, {
        withCredentials: true,
      });
      if (res.status === 200 || res.status === 202) {
        toast.success(res.data.message || "Profil ma'lumotlari yangilandi");
        setIsEditing(false);
        if (res.data.user) {
          setUser(res.data.user);
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Yangilashda xatolik yuz berdi",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPass = formData.get("currentPassword") as string;
    const newPass = formData.get("newPassword") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    if (newPass !== confirmPass) {
      return toast.error("Yangi parollar bir-biriga mos kelmadi");
    }

    try {
      setPasswordLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/user-pass`,
        { oldPass, newPass },
        { withCredentials: true },
      );
      if (res.status === 200 || res.status === 202) {
        toast.success(res.data.message || "Parol muvaffaqiyatli yangilandi");
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Parolni o'zgartirishda xatolik",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle set password (for OAuth users)
  const handleSetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pass = formData.get("password") as string;
    const confirmPass = formData.get("confirm-password") as string;

    if (pass !== confirmPass) {
      return toast.error("Parollar bir-biriga mos kelmadi");
    }

    try {
      const data = await axios.put(
        `${BASE_URL}/api/user-set-pass`,
        { password: pass },
        { withCredentials: true },
      );
      if (data.status === 200) {
        toast.success(data.data.message || "Parol o'rnatildi");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  // Handle reset PIN code
  const handleResetPin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = resetCode.join("");
    if (code.length < 6) {
      return toast.error("PIN kod kamida 6 raqamdan iborat bo'lishi kerak");
    }
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/reset-pass`,
        { resetPass: code },
        { withCredentials: true },
      );
      toast.success(data.message || "Xavfsizlik PIN kodi saqlandi");
      setResetCode(["", "", "", "", "", ""]);
      if (user) setUser({ ...user, resetPass: "set" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "PIN kodni saqlab bo'lmadi");
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...resetCode];
      newCode[index] = value;
      setResetCode(newCode);
      if (value && index < 5) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Quick Movie Handlers
  const handleUnlike = async (movieId: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/un-liked-movie/${movieId}`, {
        withCredentials: true,
      });
      setLikedMovies((prev) => prev.filter((m) => m.id !== movieId));
      toast.success("Film yoqtirilganlardan o'chirildi");
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleUnsave = async (movieId: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/un-saved-movie/${movieId}`, {
        withCredentials: true,
      });
      setSavedMovies((prev) => prev.filter((m) => m.id !== movieId));
      toast.success("Film saqlanganlardan o'chirildi");
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const tabs = [
    {
      id: "saved",
      name: "Saqlanganlar",
      icon: IoBookmarkOutline,
      count: savedMovies.length,
    },
    {
      id: "liked",
      name: "Yoqtirilganlar",
      icon: IoHeartOutline,
      count: likedMovies.length,
    },
    { id: "info", name: "Shaxsiy Ma'lumotlar", icon: IoPersonCircleOutline },
    { id: "security", name: "Xavfsizlik & Parol", icon: IoKeyOutline },
    { id: "stats", name: "Faollik & Statistika", icon: IoBarChartOutline },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "2024";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white">
      <MenuBar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* ================= HERO PROFILE BANNER ================= */}
        <div className="relative rounded-3xl bg-linear-to-b from-white/5 to-transparent border border-white/10 p-6 sm:p-8 backdrop-blur-md mb-8 overflow-hidden shadow-2xl">
          {/* Ambient red backlight */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar with Camera upload button */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-linear-to-br from-red-600 to-red-900 flex items-center justify-center overflow-hidden ring-2 ring-white/10 shadow-lg">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-extrabold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload Overlay */}
              <div className="absolute -bottom-1 -right-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-lg transition-transform group-hover:scale-110 cursor-pointer">
                <IoCameraOutline className="text-base" />
                <UploadButton
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: any) => {
                    const url = res?.[0]?.ufsUrl || res?.[0]?.url;
                    if (!url) return;
                    axios
                      .put(
                        `${BASE_URL}/api/user-avatar`,
                        { url },
                        { withCredentials: true },
                      )
                      .then((res) => {
                        if (res.status === 200) {
                          toast.success("Avatar yangilandi");
                          setUpdatedAvatar((prev) => !prev);
                        }
                      })
                      .catch((err) => console.error(err));
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Rasm yuklashda xatolik: ${error.message}`);
                  }}
                />
              </div>
            </div>

            {/* User Meta Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.name}
                </h1>
                {user?.role === "admin" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                    <IoShieldCheckmarkOutline />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/10">
                    VIP Member
                  </span>
                )}
                <span className="text-[11px] font-medium text-gray-400 capitalize px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                  {user?.provider || "local"} hisob
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                {user?.email}
              </p>

              {/* Quick Summary Chips */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5">
                  <IoFilmOutline className="text-amber-400" />
                  <span className="font-semibold text-white">
                    {savedMovies.length}
                  </span>
                  <span className="text-gray-400">Saqlangan</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5">
                  <IoHeartOutline className="text-pink-500" />
                  <span className="font-semibold text-white">
                    {likedMovies.length}
                  </span>
                  <span className="text-gray-400">Yoqtirilgan</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5">
                  <IoCalendarOutline className="text-blue-400" />
                  <span className="text-gray-400">A'zolik:</span>
                  <span className="font-semibold text-white">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                setActiveTab("info");
                setIsEditing(!isEditing);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            >
              <IoPencilOutline className="text-sm" />
              <span>
                {isEditing ? "Tahrirlashni yopish" : "Profilni tahrirlash"}
              </span>
            </button>
          </div>
        </div>

        {/* ================= INTERACTIVE TAB CONTROLS ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide border-b border-white/5">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30"
                  : "bg-white/2 text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="text-base" />
              <span>{tab.name}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id
                      ? "bg-white text-red-600"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: SAVED MOVIES ================= */}
        {activeTab === "saved" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <IoBookmarkOutline className="text-amber-500 text-xl" />
                <span>Tomosha Ro'yxatim (Saved Watchlist)</span>
              </h2>
              <span className="text-xs text-gray-400">
                Jami: {savedMovies.length} ta
              </span>
            </div>

            {savedMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {savedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="relative bg-[#121216] rounded-xl overflow-hidden border border-white/5 group hover:border-amber-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-2/3 relative bg-gray-900 overflow-hidden">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                          alt={movie.title || "Film"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                          Rasm yo'q
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link
                          href={`/${movie.id}`}
                          className="p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-110"
                          title="Tomosha qilish"
                        >
                          <IoPlayOutline className="text-lg" />
                        </Link>
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                        {movie.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                          <IoStarOutline className="text-xs" />
                          {movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : "N/A"}
                        </span>
                        <button
                          onClick={() => handleUnsave(movie.id)}
                          title="Ro'yxatdan o'chirish"
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        >
                          <IoTrashOutline className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/1 rounded-2xl border border-white/5">
                <IoBookmarkOutline className="text-5xl text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-300">
                  Saqlangan filmlar mavjud emas
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
                  Istalgan film kartochkasidagi xatcho'p (bookmark) belgisini
                  bosib, uni tomosha ro'yxatingizga qo'shing.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all"
                >
                  <span>Filmlarni kashf qilish</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: LIKED MOVIES ================= */}
        {activeTab === "liked" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <IoHeartOutline className="text-pink-500 text-xl" />
                <span>Yoqtirilgan Filmlar (Favorites)</span>
              </h2>
              <span className="text-xs text-gray-400">
                Jami: {likedMovies.length} ta
              </span>
            </div>

            {likedMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {likedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="relative bg-[#121216] rounded-xl overflow-hidden border border-white/5 group hover:border-pink-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-2/3 relative bg-gray-900 overflow-hidden">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                          alt={movie.title || "Film"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                          Rasm yo'q
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link
                          href={`/${movie.id}`}
                          className="p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-110"
                          title="Tomosha qilish"
                        >
                          <IoPlayOutline className="text-lg" />
                        </Link>
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                        {movie.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                          <IoStarOutline className="text-xs" />
                          {movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : "N/A"}
                        </span>
                        <button
                          onClick={() => handleUnlike(movie.id)}
                          title="Yoqtirilganlardan o'chirish"
                          className="text-gray-500 hover:text-pink-400 transition-colors p-1"
                        >
                          <IoTrashOutline className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/1 rounded-2xl border border-white/5">
                <IoHeartOutline className="text-5xl text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-300">
                  Yoqtirilgan filmlar mavjud emas
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
                  Sizga ma'qul kelgan filmlarga yurakcha (like) bosib, ularni
                  shaxsiy to'plamingizga jamlang.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all"
                >
                  <span>Filmlarni kashf qilish</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PERSONAL INFORMATION ================= */}
        {activeTab === "info" && (
          <div className="max-w-2xl bg-[#121216] rounded-2xl border border-white/5 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-1">
              Shaxsiy Ma'lumotlar
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Platformadagi ismingiz va email manzilingizni yangilang
            </p>

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  To'liq Ism
                </label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 disabled:opacity-50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email Manzili
                </label>
                <input
                  type="email"
                  required
                  disabled={!isEditing}
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 disabled:opacity-50 transition-colors"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Ma'lumotlarni o'zgartirish
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {editLoading
                        ? "Saqlanmoqda..."
                        : "O'zgarishlarni saqlash"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 4: SECURITY & PASSWORD ================= */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Management Card */}
            <div className="bg-[#121216] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoKeyOutline className="text-red-500 text-lg" />
                <h3 className="text-base font-semibold text-white">
                  Parolni Yangilash
                </h3>
              </div>

              {user?.password ? (
                <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Amaldagi Parol
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      placeholder="••••••••"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Yangi Parol
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      minLength={6}
                      placeholder="Kamida 6 belgi"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Yangi Parolni Tasdiqlang
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full mt-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {passwordLoading ? "Yangilanmoqda..." : "Parolni Yangilash"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSetPassword} className="space-y-3.5">
                  <p className="text-xs text-yellow-500/90 mb-2">
                    Siz Google yoki GitHub orqali ro'yxatdan o'tgansiz. Tizimga
                    email/parol bilan ham kirish uchun yangi parol o'rnating.
                  </p>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Parol
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Parolni Tasdiqlang
                    </label>
                    <input
                      type="password"
                      name="confirm-password"
                      required
                      minLength={6}
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Parol O'rnatish
                  </button>
                </form>
              )}
            </div>

            {/* 6-digit Reset PIN Card */}
            <div className="bg-[#121216] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoLockOpenOutline className="text-red-500 text-lg" />
                <h3 className="text-base font-semibold text-white">
                  6-Xonali Qayta Tiklash PIN Kodi
                </h3>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Parolingizni unutgan taqdirda tezda qayta tiklash uchun shaxsiy
                6 xonali maxfiy raqamingizni belgilang.
              </p>

              <form onSubmit={handleResetPin} className="space-y-4">
                <div className="flex gap-2 justify-center py-2">
                  {resetCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pin-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      className="w-10 h-11 text-center bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-red-600 transition-colors"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  PIN Kodni Saqlash
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 5: WATCH STATS ================= */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121216] p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Saqlangan Filmlar
                </span>
                <div className="text-3xl font-extrabold text-white mt-2">
                  {savedMovies.length}
                </div>
                <p className="text-[11px] text-amber-400 mt-1">
                  Watchlist to'plamida
                </p>
              </div>

              <div className="bg-[#121216] p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Yoqtirilgan Filmlar
                </span>
                <div className="text-3xl font-extrabold text-pink-500 mt-2">
                  {likedMovies.length}
                </div>
                <p className="text-[11px] text-pink-400 mt-1">Like bosilgan</p>
              </div>

              <div className="bg-[#121216] p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Jami Faollik
                </span>
                <div className="text-3xl font-extrabold text-white mt-2">
                  {savedMovies.length + likedMovies.length}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Interaksiyalar soni
                </p>
              </div>

              <div className="bg-[#121216] p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Hisob Statusi
                </span>
                <div className="text-lg font-bold text-emerald-400 mt-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Faol A'zo</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {user?.provider || "Local"} ulanish
                </p>
              </div>
            </div>

            <div className="bg-[#121216] rounded-2xl border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                Tavsiya va Yangilanishlar
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Netflix platformasi sizning yoqtirgan va saqlagan filmlaringiz
                asosida bosh sahifadagi karusellarda shaxsiy tavsiyalarni
                shakllantiradi. Qancha ko'p film yoqtirsangiz, siz uchun
                qiziqarli yangi kinolar shunchalik aniq tavsiya etiladi.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
