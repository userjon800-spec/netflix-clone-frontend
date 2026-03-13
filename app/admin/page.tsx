"use client";
import { BASE_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCalendarOutline,
  IoHeartOutline,
  IoBookmarkOutline,
  IoShieldOutline,
  IoSearchOutline,
} from "react-icons/io5";
import Loading from "@/components/loading";
import { User } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLikes: 0,
    totalSaves: 0,
    avgLikesPerUser: 0,
    avgSavesPerUser: 0,
  });
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin`, { withCredentials: true })
      .then((res) => {
        const userData = res.data.allUsers || [];
        setUsers(userData);
        const totalLikes = userData.reduce(
          (acc: number, user: User) => acc + (user.likedMovie?.length || 0),
          0,
        );
        const totalSaves = userData.reduce(
          (acc: number, user: User) => acc + (user.savedMovie?.length || 0),
          0,
        );
        setStats({
          totalUsers: userData.length,
          totalLikes,
          totalSaves,
          avgLikesPerUser: userData.length
            ? Math.round((totalLikes / userData.length) * 10) / 10
            : 0,
          avgSavesPerUser: userData.length
            ? Math.round((totalSaves / userData.length) * 10) / 10
            : 0,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/logout`,
        {},
        { withCredentials: true },
      );
      toast.success(data.message);
      localStorage.clear();
      setTimeout(() => router.replace("/auth/signin"), 1500);
    } catch (error) {
      console.error(error);
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-4 h-fit ">
        <button
          onClick={logout}
          className="w-full h-15 bg-red-700 text-[22px] font-bold cursor-pointer rounded-2xl px-4 py-2 active:scale-99"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          Sign Out
        </button>
      </div>
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage users and monitor platform activity
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <IoPersonOutline className="text-red-500 text-xl" />
              <span className="text-2xl font-bold text-white">
                {stats.totalUsers}
              </span>
            </div>
            <p className="text-xs text-gray-400">Total Users</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <IoHeartOutline className="text-red-500 text-xl" />
              <span className="text-2xl font-bold text-white">
                {stats.totalLikes}
              </span>
            </div>
            <p className="text-xs text-gray-400">Total Likes</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <IoBookmarkOutline className="text-yellow-500 text-xl" />
              <span className="text-2xl font-bold text-white">
                {stats.totalSaves}
              </span>
            </div>
            <p className="text-xs text-gray-400">Total Saves</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <IoHeartOutline className="text-pink-500 text-xl" />
              <span className="text-2xl font-bold text-white">
                {stats.avgLikesPerUser}
              </span>
            </div>
            <p className="text-xs text-gray-400">Avg Likes/User</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <IoBookmarkOutline className="text-orange-500 text-xl" />
              <span className="text-2xl font-bold text-white">
                {stats.avgSavesPerUser}
              </span>
            </div>
            <p className="text-xs text-gray-400">Avg Saves/User</p>
          </div>
        </div>
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors text-sm"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          </div>
        </div>
        <div className="bg-gray-900/30 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Liked
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Saved
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Provider
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-white">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <IoMailOutline className="text-gray-500 text-sm" />
                        <span className="text-sm text-gray-300">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <IoCalendarOutline className="text-gray-500 text-sm" />
                        <span className="text-sm text-gray-300">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded-full">
                        <IoHeartOutline className="text-red-500 text-xs" />
                        <span className="text-xs font-medium text-white">
                          {user.likedMovie?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-full">
                        <IoBookmarkOutline className="text-yellow-500 text-xs" />
                        <span className="text-xs font-medium text-white">
                          {user.savedMovie?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <IoShieldOutline
                          className={`text-sm ${
                            user.role === "admin"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            user.role === "admin"
                              ? "text-red-500 font-medium"
                              : "text-gray-300"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-300">
                        {user.provider || "local"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <IoPersonOutline className="text-4xl text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No users found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
          <span>Total users: {users.length}</span>
          <span>
            Showing {filteredUsers.length} of {users.length}
          </span>
        </div>
      </div>
    </div>
  );
}