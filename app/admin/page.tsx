"use client";
import { BASE_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { User, AdminStats, Movie } from "@/types";
import {
  IoPersonOutline,
  IoHeartOutline,
  IoBookmarkOutline,
  IoShieldOutline,
  IoShieldCheckmarkOutline,
  IoSearchOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoServerOutline,
  IoSpeedometerOutline,
  IoBarChartOutline,
  IoPeopleOutline,
  IoFilmOutline,
  IoCloseOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoBanOutline,
  IoCheckmarkCircleOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoFlameOutline,
  IoStarOutline,
} from "react-icons/io5";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "content">(
    "overview",
  );

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned">(
    "all",
  );
  const [providerFilter, setProviderFilter] = useState<
    "all" | "local" | "google" | "github"
  >("all");

  // Modals state
  const [selectedUserActivity, setSelectedUserActivity] = useState<{
    user: User;
    likedMovies: Movie[];
    savedMovies: Movie[];
  } | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityTab, setActivityTab] = useState<"liked" | "saved">("liked");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });
  const [editLoading, setEditLoading] = useState(false);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all initial data
  const loadDashboardData = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Iltimos avval administrator sifatida kiring");
      router.replace("/auth/signin");
      return;
    }

    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/admin/stats`, { withCredentials: true }),
      ]);
      setUsers(usersRes.data.allUsers || []);
      setStats(statsRes.data.stats || null);
    } catch (err: any) {
      console.error("Admin dashboard error:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        toast.error(
          err.response?.data?.message || "Faqat administratorlar uchun ruxsat etilgan"
        );
        router.replace("/");
      } else {
        toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "banned" ? user.isBanned : !user.isBanned);
      const matchesProvider =
        providerFilter === "all" || user.provider === providerFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesProvider;
    });
  }, [users, searchTerm, roleFilter, statusFilter, providerFilter]);

  // Actions
  const handleToggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/role/${user._id}`,
        { role: newRole },
        { withCredentials: true },
      );
      toast.success(
        data.message || `Foydalanuvchi roli ${newRole}ga o'zgartirildi`,
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)),
      );
      if (stats) {
        setStats({
          ...stats,
          totalAdmins:
            newRole === "admin"
              ? stats.totalAdmins + 1
              : Math.max(0, stats.totalAdmins - 1),
        });
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Rolni o'zgartirishda xatolik",
      );
    }
  };

  const handleToggleBan = async (user: User) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/ban/${user._id}`,
        {},
        { withCredentials: true },
      );
      const isNowBanned = data.isBanned;
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBanned: isNowBanned } : u,
        ),
      );
      if (stats) {
        setStats({
          ...stats,
          totalBanned: isNowBanned
            ? stats.totalBanned + 1
            : Math.max(0, stats.totalBanned - 1),
        });
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Statusni o'zgartirishda xatolik",
      );
    }
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({ name: user.name || "", email: user.email || "" });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setEditLoading(true);
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/user/${editingUser._id}`,
        editFormData,
        { withCredentials: true },
      );
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id
            ? { ...u, name: editFormData.name, email: editFormData.email }
            : u,
        ),
      );
      setEditingUser(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      setDeleteLoading(true);
      const { data } = await axios.delete(
        `${BASE_URL}/api/admin/user/${deletingUser._id}`,
        { withCredentials: true },
      );
      toast.success(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
      if (stats) {
        setStats({
          ...stats,
          totalUsers: Math.max(0, stats.totalUsers - 1),
          totalAdmins:
            deletingUser.role === "admin"
              ? Math.max(0, stats.totalAdmins - 1)
              : stats.totalAdmins,
          totalBanned: deletingUser.isBanned
            ? Math.max(0, stats.totalBanned - 1)
            : stats.totalBanned,
        });
      }
      setDeletingUser(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "O'chirishda xatolik");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInspectUser = async (user: User) => {
    try {
      setActivityLoading(true);
      setSelectedUserActivity({
        user,
        likedMovies: [],
        savedMovies: [],
      });
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/user/${user._id}/activity`,
        { withCredentials: true },
      );
      setSelectedUserActivity({
        user: data.user || user,
        likedMovies: data.likedMovies || [],
        savedMovies: data.savedMovies || [],
      });
    } catch (error: any) {
      toast.error("Foydalanuvchi faoliyatini yuklab bo'lmadi");
    } finally {
      setActivityLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["ID,Name,Email,Role,Status,Provider,Likes,Saves,Joined\n"];
    const rows = filteredUsers.map((u) => {
      const cleanName = `"${(u.name || "").replace(/"/g, '""')}"`;
      const cleanEmail = `"${(u.email || "").replace(/"/g, '""')}"`;
      const role = u.role || "user";
      const status = u.isBanned ? "Banned" : "Active";
      const provider = u.provider || "local";
      const likes = u.likedMovie?.length || 0;
      const saves = u.savedMovie?.length || 0;
      const joined = u.createdAt ? new Date(u.createdAt).toISOString() : "";
      return `${u._id},${cleanName},${cleanEmail},${role},${status},${provider},${likes},${saves},${joined}\n`;
    });

    const blob = new Blob([...headers, ...rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `netflix-users-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV fayl muvaffaqiyatli yuklab olindi");
  };

  const handleSignOut = async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });
      localStorage.clear();
      toast.success("Tizimdan chiqildi");
      router.replace("/auth/signin");
    } catch (err) {
      localStorage.clear();
      router.replace("/auth/signin");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return "0 daqiqa";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs} soat ${mins} daqiqa`;
    return `${mins} daqiqa`;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0c0c0e]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-red-600 font-extrabold text-2xl tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>NETFLIX</span>
              <span className="text-xs bg-red-600/20 text-red-500 px-2 py-0.5 rounded-md border border-red-500/30 font-semibold tracking-wider uppercase">
                Admin
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitoring Faol</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="Yangilash"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <IoRefreshOutline
                className={`text-lg ${refreshing ? "animate-spin text-red-500" : ""}`}
              />
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              <IoHomeOutline className="text-sm" />
              <span className="hidden sm:inline">Saytga qaytish</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/20 transition-all cursor-pointer"
            >
              <IoLogOutOutline className="text-sm" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Segmented Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Boshqaruv & Monitoring Paneli
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Foydalanuvchilarni tahrirlash, huquqlarni boshqarish va platforma
              metrikalari
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IoBarChartOutline className="text-sm" />
              <span>Analitika</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IoPeopleOutline className="text-sm" />
              <span>Foydalanuvchilar ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "content"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IoFilmOutline className="text-sm" />
              <span>Ommabop Kontent</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Foydalanuvchilar
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <IoPersonOutline className="text-lg" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats?.totalUsers ?? users.length}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Ro'yxatdan o'tganlar
                  </p>
                </div>
              </div>

              <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Adminlar
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <IoShieldCheckmarkOutline className="text-lg" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats?.totalAdmins ??
                      users.filter((u) => u.role === "admin").length}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Boshqaruv huquqiga ega
                  </p>
                </div>
              </div>

              <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Yoqtirilganlar
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <IoHeartOutline className="text-lg" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats?.totalLikes ?? 0}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Liked filmlar soni
                  </p>
                </div>
              </div>

              <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Saqlanganlar
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <IoBookmarkOutline className="text-lg" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats?.totalSaves ?? 0}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Saved ro'yxatida
                  </p>
                </div>
              </div>

              <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 relative overflow-hidden col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bloklanganlar
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500">
                    <IoBanOutline className="text-lg" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-500">
                    {stats?.totalBanned ??
                      users.filter((u) => u.isBanned).length}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Kirishi to'xtatilgan
                  </p>
                </div>
              </div>
            </div>

            {/* Deep Monitoring: System Health & Provider Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Server & System Status Card */}
              <div className="bg-[#121216] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <IoServerOutline className="text-red-500 text-lg" />
                  <h3 className="text-base font-semibold text-white">
                    Tizim va Server Holati
                  </h3>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                    <span className="text-xs text-gray-400">
                      Ma'lumotlar bazasi (MongoDB)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {stats?.system.mongoStatus || "Ulangan"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                    <span className="text-xs text-gray-400">
                      Xotira sarfi (RAM)
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {stats?.system.memoryUsageMB
                        ? `${stats.system.memoryUsageMB} MB`
                        : "Normal"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                    <span className="text-xs text-gray-400">
                      Server Uzluksiz Ish Vaqti (Uptime)
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {formatUptime(stats?.system.uptime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                    <span className="text-xs text-gray-400">
                      Muhit & Versiya
                    </span>
                    <span className="text-xs font-semibold text-gray-300">
                      Node {stats?.system.nodeVersion || "v20"} (
                      {stats?.system.platform || "win32"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Provider Distribution Card */}
              <div className="bg-[#121216] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <IoSpeedometerOutline className="text-red-500 text-lg" />
                  <h3 className="text-base font-semibold text-white">
                    Kirish Manbalari Taqsimoti
                  </h3>
                </div>

                {stats && (
                  <div className="space-y-4">
                    {/* Local auth */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-300 font-medium">
                          Email / Parol (Local)
                        </span>
                        <span className="text-gray-400 font-semibold">
                          {stats.providers.local} (
                          {Math.round(
                            (stats.providers.local / (stats.totalUsers || 1)) *
                              100,
                          )}
                          %)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-red-600 rounded-full transition-all"
                          style={{
                            width: `${(stats.providers.local / (stats.totalUsers || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Google OAuth */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-300 font-medium">
                          Google OAuth
                        </span>
                        <span className="text-gray-400 font-semibold">
                          {stats.providers.google} (
                          {Math.round(
                            (stats.providers.google / (stats.totalUsers || 1)) *
                              100,
                          )}
                          %)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{
                            width: `${(stats.providers.google / (stats.totalUsers || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* GitHub OAuth */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-300 font-medium">
                          GitHub OAuth
                        </span>
                        <span className="text-gray-400 font-semibold">
                          {stats.providers.github} (
                          {Math.round(
                            (stats.providers.github / (stats.totalUsers || 1)) *
                              100,
                          )}
                          %)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{
                            width: `${(stats.providers.github / (stats.totalUsers || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-gray-500">
                      Barcha hisoblar xavfsiz JWT va shifrlangan seanslar bilan
                      himoyalangan.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: USERS MANAGEMENT ================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ism, email yoki ID bo'yicha qidiruv..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors text-sm"
                />
                <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e: any) => setRoleFilter(e.target.value)}
                  className="h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-red-600 cursor-pointer"
                >
                  <option value="all" className="bg-[#121216]">
                    Barcha Rollar
                  </option>
                  <option value="admin" className="bg-[#121216]">
                    Adminlar
                  </option>
                  <option value="user" className="bg-[#121216]">
                    Oddiy Foydalanuvchilar
                  </option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-red-600 cursor-pointer"
                >
                  <option value="all" className="bg-[#121216]">
                    Barcha Statuslar
                  </option>
                  <option value="active" className="bg-[#121216]">
                    Faol
                  </option>
                  <option value="banned" className="bg-[#121216]">
                    Bloklangan
                  </option>
                </select>

                {/* Provider filter */}
                <select
                  value={providerFilter}
                  onChange={(e: any) => setProviderFilter(e.target.value)}
                  className="h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-red-600 cursor-pointer"
                >
                  <option value="all" className="bg-[#121216]">
                    Barcha Manbalar
                  </option>
                  <option value="local" className="bg-[#121216]">
                    Local
                  </option>
                  <option value="google" className="bg-[#121216]">
                    Google
                  </option>
                  <option value="github" className="bg-[#121216]">
                    GitHub
                  </option>
                </select>

                {/* Export CSV button */}
                <button
                  onClick={exportCSV}
                  className="h-10 px-3.5 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer font-medium"
                >
                  <IoDownloadOutline className="text-sm" />
                  <span>CSV Eksport</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#121216] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Foydalanuvchi</th>
                      <th className="py-3.5 px-4">Email / Manba</th>
                      <th className="py-3.5 px-4">Rol</th>
                      <th className="py-3.5 px-4">Holat</th>
                      <th className="py-3.5 px-4 text-center">Faollik (L/S)</th>
                      <th className="py-3.5 px-4">Qo'shilgan</th>
                      <th className="py-3.5 px-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-white/2 transition-colors group"
                      >
                        {/* User Avatar + Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-white/10">
                              {user.avatar ? (
                                <Image
                                  src={user.avatar}
                                  alt={user.name}
                                  width={36}
                                  height={36}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-bold text-white">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {user.role === "admin" && (
                                  <IoShieldCheckmarkOutline
                                    className="text-red-500 text-xs"
                                    title="Administrator"
                                  />
                                )}
                              </div>
                              <span className="text-[11px] text-gray-500 font-mono">
                                {user._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email & Provider */}
                        <td className="py-3 px-4">
                          <div className="text-gray-300 text-xs font-medium">
                            {user.email}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-medium text-gray-400 capitalize bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                            {user.provider || "local"}
                          </span>
                        </td>

                        {/* Role with 1-click toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleRole(user)}
                            title="Rolni o'zgartirish uchun bosing"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                              user.role === "admin"
                                ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                            }`}
                          >
                            <IoShieldOutline className="text-xs" />
                            <span>
                              {user.role === "admin" ? "Admin" : "User"}
                            </span>
                          </button>
                        </td>

                        {/* Status (Active / Banned) with toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleBan(user)}
                            title="Statusni o'zgartirish uchun bosing"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                              user.isBanned
                                ? "bg-red-600/15 text-red-400 border-red-600/30 hover:bg-red-600/30"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            {user.isBanned ? (
                              <>
                                <IoBanOutline className="text-xs" />
                                <span>Bloklangan</span>
                              </>
                            ) : (
                              <>
                                <IoCheckmarkCircleOutline className="text-xs" />
                                <span>Faol</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Liked & Saved Stats */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <span
                              className="inline-flex items-center gap-1 text-xs text-pink-400 font-medium"
                              title="Yoqtirilgan filmlar"
                            >
                              <IoHeartOutline className="text-xs" />
                              {user.likedMovie?.length || 0}
                            </span>
                            <span className="text-gray-600">/</span>
                            <span
                              className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium"
                              title="Saqlangan filmlar"
                            >
                              <IoBookmarkOutline className="text-xs" />
                              {user.savedMovie?.length || 0}
                            </span>
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Actions column */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Inspect Activity */}
                            <button
                              onClick={() => handleInspectUser(user)}
                              title="Faoliyatni ko'rish"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/5"
                            >
                              <IoFilmOutline className="text-sm" />
                            </button>

                            {/* Edit User Info */}
                            <button
                              onClick={() => handleOpenEdit(user)}
                              title="Tahrirlash"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer border border-blue-500/20"
                            >
                              <IoPencilOutline className="text-sm" />
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => setDeletingUser(user)}
                              title="O'chirish"
                              className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer border border-red-500/20"
                            >
                              <IoTrashOutline className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                  <IoPeopleOutline className="text-4xl text-gray-600 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-300">
                    Foydalanuvchilar topilmadi
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring
                  </p>
                </div>
              )}

              {/* Footer info */}
              <div className="py-3 px-4 bg-white/1 border-t border-white/5 text-xs text-gray-400 flex items-center justify-between">
                <span>Jami foydalanuvchilar: {users.length} ta</span>
                <span>Ko'rsatilmoqda: {filteredUsers.length} ta</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CONTENT & ANALYTICS ================= */}
        {activeTab === "content" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <IoFlameOutline className="text-red-500 text-xl" />
                <span>Eng Ko'p Yoqtirilgan Filmlar (Top Liked)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Foydalanuvchilar tomonidan eng ko'p yoqtirish olgan filmlar
                reytingi
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {stats?.topLikedMovies && stats.topLikedMovies.length > 0 ? (
                  stats.topLikedMovies.map((movie, idx) => (
                    <div
                      key={movie._id || idx}
                      className="bg-[#121216] rounded-xl overflow-hidden border border-white/5 group hover:border-red-500/40 transition-all"
                    >
                      <div className="aspect-2/3 relative bg-gray-900 overflow-hidden">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title || "Film"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            Rasm yo'q
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-red-500 text-xs font-bold px-2 py-0.5 rounded-md border border-white/10">
                          #{idx + 1}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-pink-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                          <IoHeartOutline />
                          {movie.count}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {movie.title || `Film #${movie._id}`}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <IoStarOutline className="text-xs" />
                            {movie.vote_average
                              ? movie.vote_average.toFixed(1)
                              : "N/A"}
                          </span>
                          <span className="text-gray-500 text-[10px]">
                            TMDB: {movie._id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500 text-xs">
                    Hali yoqtirilgan filmlar mavjud emas
                  </div>
                )}
              </div>
            </div>

            {/* Top Saved Movies */}
            <div className="pt-4 border-t border-white/5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <IoBookmarkOutline className="text-amber-500 text-xl" />
                <span>Eng Ko'p Saqlangan Filmlar (Top Saved)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Tomosha qilish ro'yxatiga (Watchlist) eng ko'p qo'shilgan
                filmlar
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {stats?.topSavedMovies && stats.topSavedMovies.length > 0 ? (
                  stats.topSavedMovies.map((movie, idx) => (
                    <div
                      key={movie._id || idx}
                      className="bg-[#121216] rounded-xl overflow-hidden border border-white/5 group hover:border-amber-500/40 transition-all"
                    >
                      <div className="aspect-2/3 relative bg-gray-900 overflow-hidden">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title || "Film"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            Rasm yo'q
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md border border-white/10">
                          #{idx + 1}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-amber-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                          <IoBookmarkOutline />
                          {movie.count}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {movie.title || `Film #${movie._id}`}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <IoStarOutline className="text-xs" />
                            {movie.vote_average
                              ? movie.vote_average.toFixed(1)
                              : "N/A"}
                          </span>
                          <span className="text-gray-500 text-[10px]">
                            TMDB: {movie._id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500 text-xs">
                    Hali saqlangan filmlar mavjud emas
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL 1: USER ACTIVITY INSPECTION ================= */}
      {selectedUserActivity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center overflow-hidden">
                  {selectedUserActivity.user.avatar ? (
                    <Image
                      src={selectedUserActivity.user.avatar}
                      alt={selectedUserActivity.user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {selectedUserActivity.user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedUserActivity.user.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 capitalize">
                      {selectedUserActivity.user.role}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    {selectedUserActivity.user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserActivity(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-5 pt-3 border-b border-white/5 flex gap-4">
              <button
                onClick={() => setActivityTab("liked")}
                className={`pb-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activityTab === "liked"
                    ? "border-red-600 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <IoHeartOutline className="text-pink-500" />
                <span>
                  Yoqtirgan filmlari ({selectedUserActivity.likedMovies.length})
                </span>
              </button>
              <button
                onClick={() => setActivityTab("saved")}
                className={`pb-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activityTab === "saved"
                    ? "border-red-600 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <IoBookmarkOutline className="text-amber-500" />
                <span>
                  Saqlagan filmlari ({selectedUserActivity.savedMovies.length})
                </span>
              </button>
            </div>

            {/* Modal Body: Movie Grid */}
            <div className="p-5 overflow-y-auto flex-1">
              {activityLoading ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Faoliyat ma'lumotlari yuklanmoqda...
                </div>
              ) : (
                <>
                  {activityTab === "liked" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedUserActivity.likedMovies.map((movie) => (
                        <div
                          key={movie.id}
                          className="bg-white/2 border border-white/5 rounded-xl overflow-hidden"
                        >
                          <div className="aspect-2/3 relative bg-gray-900">
                            {movie.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title || "Film"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                                Poster yo'q
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h5 className="text-xs font-medium text-white line-clamp-1">
                              {movie.title}
                            </h5>
                            <span className="text-[10px] text-gray-400">
                              {movie.release_date?.slice(0, 4) || "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                      {selectedUserActivity.likedMovies.length === 0 && (
                        <div className="col-span-full py-12 text-center text-xs text-gray-500">
                          Ushbu foydalanuvchi hali biron filmga like bosmagan
                        </div>
                      )}
                    </div>
                  )}

                  {activityTab === "saved" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedUserActivity.savedMovies.map((movie) => (
                        <div
                          key={movie.id}
                          className="bg-white/2 border border-white/5 rounded-xl overflow-hidden"
                        >
                          <div className="aspect-2/3 relative bg-gray-900">
                            {movie.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title || "Film"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                                Poster yo'q
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h5 className="text-xs font-medium text-white line-clamp-1">
                              {movie.title}
                            </h5>
                            <span className="text-[10px] text-gray-400">
                              {movie.release_date?.slice(0, 4) || "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                      {selectedUserActivity.savedMovies.length === 0 && (
                        <div className="col-span-full py-12 text-center text-xs text-gray-500">
                          Ushbu foydalanuvchi hali filmlarni saqlamagan
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT USER ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <IoPencilOutline className="text-blue-400" />
                <span>Foydalanuvchini Tahrirlash</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Foydalanuvchi Ismi
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email Manzili
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {editLoading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: DELETE CONFIRMATION ================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-600/10 text-red-500 mx-auto flex items-center justify-center text-2xl mb-4 border border-red-500/20">
              <IoTrashOutline />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Foydalanuvchini o'chirmoqchimisiz?
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              <strong className="text-white">{deletingUser.name}</strong> (
              {deletingUser.email}) hisobi va unga tegishli barcha yoqtirilgan
              hamda saqlangan filmlar butunlay o'chiriladi. Bu amalni ortga
              qaytarib bo'lmaydi.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? "O'chirilmoqda..." : "Ha, O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
