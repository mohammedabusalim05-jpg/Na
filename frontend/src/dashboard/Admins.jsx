// src/dashboard/Admins.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/index";
import toast from "react-hot-toast";

export default function Admins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: ""
    });

    const fetchAdmins = async () => {
        try {
            const res = await api.get("/accounts/admins/");
            setAdmins(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch admins");
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/accounts/admins/create/", newAdmin);
            toast.success("Admin added successfully");
            setAdmins([...admins, { ...newAdmin, id: res.data.id, first_name: newAdmin.name, last_login: null }]); // Optimistic add
            setShowModal(false);
            setNewAdmin({ name: "", email: "", password: "" });
            fetchAdmins(); // Refresh to be sure
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create admin");
        }
    };

    const deleteAdmin = async (id) => {
        if (!confirm("Are you sure you want to remove this admin?")) return;
        try {
            await api.delete(`/accounts/admins/${id}/`);
            setAdmins(admins.filter(a => a.id !== id));
            toast.success("Admin removed");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove admin");
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div className="text-white space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold">Admins Management</h1>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-sm font-medium transition"
                    >
                        + Add Admin
                    </button>
                </div>
            </div>

            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl overflow-x-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {loading ? (
                    <p className="text-gray-300">Loading admins...</p>
                ) : (
                    <table className="w-full text-left text-gray-300 text-sm md:text-base">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/20">
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Level</th>
                                <th className="py-2 pr-4">Last Login</th>
                                <th className="py-2 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((a, i) => (
                                <motion.tr
                                    key={a.id}
                                    className="border-b border-white/10 hover:bg-white/5 transition"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                >
                                    <td className="py-2 pr-4">{a.first_name || a.username || "Admin"}</td>
                                    <td className="py-2 pr-4">{a.email}</td>
                                    <td className="py-2 pr-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${a.is_superuser ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"}`}>
                                            {a.is_superuser ? "Super Admin" : "Staff"}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-4">{a.last_login ? new Date(a.last_login).toLocaleString() : "Never"}</td>
                                    <td className="py-2 pr-4 space-x-2">
                                        <button
                                            onClick={() => deleteAdmin(a.id)}
                                            className="text-xs px-3 py-1 rounded-full bg-red-600/80 hover:bg-red-700 text-white transition"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </motion.div>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-slate-900 border border-white/20 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-bold text-white mb-4">Add New Admin</h2>
                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={newAdmin.name}
                                        onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={newAdmin.email}
                                        onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Password</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={newAdmin.password}
                                        onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-4"
                                >
                                    Create Admin
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
