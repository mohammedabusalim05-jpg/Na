// src/dashboard/Users.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/index";
import toast from "react-hot-toast";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/accounts/users/");
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) {
            return;
        }

        try {
            await api.delete(`/accounts/users/${id}/`);
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
            toast.success("User deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getUserDisplayName = (user) => {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

        return (
            fullName ||
            user.full_name ||
            user.user_name ||
            user.username ||
            "N/A"
        );
    };

    const getUserRole = (user) => {
        return user.role || (user.is_superuser ? "ADMIN" : "USER");
    };

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return users;
        }

        return users.filter((user) => {
            const searchableText = [
                user.id,
                getUserDisplayName(user),
                user.first_name,
                user.last_name,
                user.full_name,
                user.user_name,
                user.username,
                user.email,
                getUserRole(user),
                user.phone,
                user.governorate,
                user.blood_type,
                user.is_active ? "active" : "inactive",
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [users, searchQuery]);

    return (
        <div className="text-white space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Search, review, and manage registered users.
                    </p>
                </div>

                <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm text-gray-300">
                    Showing{" "}
                    <span className="font-bold text-white">{filteredUsers.length}</span>
                    {" "}of{" "}
                    <span className="font-bold text-white">{users.length}</span>
                    {" "}users
                </div>
            </div>

            {/* Search Bar */}
            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <label className="block text-sm text-gray-300 mb-2">
                   Search users
                </label>

                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users by ID, name, email, role, phone, or governorate"
                        className="
                            w-full rounded-xl
                            bg-slate-950/70
                            border border-white/20
                            px-4 py-3
                            text-white placeholder-gray-500
                            focus:outline-none focus:border-blue-400
                        "
                    />

                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="
                                rounded-xl
                                border border-white/20
                                px-5 py-3
                                text-sm font-semibold
                                text-white
                                hover:bg-white/10
                                transition
                            "
                        >
                            Clear
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                className="
                    bg-white/10 backdrop-blur-xl 
                    border border-white/20 
                    rounded-2xl p-4 md:p-6 
                    shadow-xl overflow-x-auto
                "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {loading ? (
                    <p className="text-gray-300">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-gray-300">
                        <p className="text-lg font-semibold">No users found</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Try searching by another name, ID, email, or role.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left text-gray-300 text-sm md:text-base">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/20">
                                <th className="py-2 pr-4">ID</th>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Role</th>
                                <th className="py-2 pr-4">Phone</th>
                                <th className="py-2 pr-4">Governorate</th>
                                <th className="py-2 pr-4">Active</th>
                                <th className="py-2 pr-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    className="border-b border-white/10 hover:bg-white/5 transition"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.03 * index }}
                                >
                                    <td className="py-3 pr-4 font-semibold text-white">
                                        {user.id}
                                    </td>

                                    <td className="py-3 pr-4">
                                        {getUserDisplayName(user)}
                                    </td>

                                    <td className="py-3 pr-4">
                                        {user.email || "N/A"}
                                    </td>

                                    <td className="py-3 pr-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300">
                                            {getUserRole(user)}
                                        </span>
                                    </td>

                                    <td className="py-3 pr-4">
                                        {user.phone || "N/A"}
                                    </td>

                                    <td className="py-3 pr-4">
                                        {user.governorate || "N/A"}
                                    </td>

                                    <td className="py-3 pr-4">
                                        <span
                                            className={`
                                                px-2 py-1 rounded-full 
                                                text-xs md:text-sm 
                                                ${user.is_active
                                                    ? "text-green-400 bg-green-500/10"
                                                    : "text-red-400 bg-red-500/10"
                                                }
                                            `}
                                        >
                                            {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="py-3 pr-4">
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </motion.div>
        </div>
    );
}