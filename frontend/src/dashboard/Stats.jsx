// src/dashboard/Stats.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDashboardStats } from "../api/index";

export default function Stats() {
    const [stats, setStats] = useState({
        total_donations: 0,
        total_users: 0,
        active_cases: 0,
        total_requests: 0,
        pending_requests: 0,
        recent_requests: [],
        donations_by_category: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();

                // ✅ يدعم كل أشكال الـ response (res.data أو res.data.data)
                const payload = res?.data?.data ? res.data.data : res.data;

                console.log("DASHBOARD PAYLOAD:", payload); // تشخيص مهم

                setStats(payload);
            } catch (err) {
                console.error("Dashboard stats error:", err);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { label: "Total Donations", value: stats.total_donations, hint: "All time" },
        { label: "Registered Users", value: stats.total_users, hint: "Active accounts" },
        { label: "Active Cases", value: stats.active_cases, hint: "Donations in progress" },
        { label: "Help Requests", value: stats.total_requests, hint: "All requests" },
        { label: "Pending Requests", value: stats.pending_requests, hint: "Waiting approval" },
    ];

    return (
        <div className="text-white space-y-8">
            {/* عنوان واضح للتأكد أن الملف هو المعروض */}
            <h1 className="text-2xl font-bold">🚨 Statistics & Insights 🚨</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {cards.map((c, i) => (
                    <motion.div
                        key={c.label}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.07 * i }}
                    >
                        <p className="text-sm text-gray-300">{c.label}</p>
                        <p className="text-3xl font-bold mt-2">{c.value}</p>
                        <p className="text-xs text-emerald-300 mt-1">{c.hint}</p>
                    </motion.div>
                ))}
            </div>

            {/* Donations by Category */}
            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                <h2 className="text-xl font-semibold mb-4">Donations by Category</h2>

                <div className="space-y-3">
                    {stats.donations_by_category && stats.donations_by_category.length > 0 ? (
                        stats.donations_by_category.map((row) => (
                            <div key={row.name}>
                                <div className="flex justify-between text-sm text-gray-300 mb-1">
                                    <span>{row.name}</span>
                                    <span>{row.value}</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-2 rounded-full bg-emerald-400/80"
                                        style={{
                                            width: `${Math.min(
                                                (row.value / Math.max(stats.total_donations, 1)) * 100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No donation data available yet.</p>
                    )}
                </div>
            </motion.div>

            {/* Recent Help Requests */}
            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <h2 className="text-xl font-semibold mb-4">Recent Help Requests</h2>

                {stats.recent_requests && stats.recent_requests.length > 0 ? (
                    <ul className="space-y-3">
                        {stats.recent_requests.map((req) => (
                            <li
                                key={req.id}
                                className="flex justify-between items-center text-sm text-gray-300 bg-white/5 rounded-xl p-3"
                            >
                                <span>{req.name}</span>
                                <span className="text-emerald-400">{req.category}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-sm">No help requests submitted yet.</p>
                )}
            </motion.div>
        </div>
    );
}
