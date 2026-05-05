import { useEffect, useState } from "react";
import {
    FaHandHoldingHeart,
    FaUsers,
    FaDonate,
    FaClipboardList,
    FaCheck,
    FaTimes,
    FaTrash
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
    getDashboardStats,
    getRequestsStats,
    updateRequestStatus,
    deleteRequest
} from "../api/index";
import api from "../api";
import toast from "react-hot-toast";

/* =========================
   Dashboard Home
========================= */

export default function DashboardHome() {
    const [stats, setStats] = useState({
        total_donations: 0,
        total_users: 0,
        active_cases: 0,
        total_requests: 0,
        pending_requests: 0,
        recent_requests: [],
        recent_donations: []
    });

    const [loading, setLoading] = useState(true);

    // 🔔 Notifications state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchData();
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    /* =========================
       Fetch Dashboard Data
    ========================= */
   const fetchData = async () => {
    try {
        const donationsRes = await api.get("/donations/");
        const donations = donationsRes?.data?.data ?? donationsRes.data ?? [];
        console.log("DONATIONS API RESPONSE:", donationsRes.data);
        console.log("DONATIONS ARRAY:", donations);

const pendingDonations = donations.filter(d => !d.is_completed);

const approvedDonations = donations.filter(d => d.is_completed);

console.log("COMPLETED VALUES:", donations.map(d => d.is_completed));
console.log("PENDING:", pendingDonations);
console.log("APPROVED/COMPLETED:", approvedDonations);
        setStats(prev => ({
            ...prev,
            total_donations: donations.length,
            active_cases: approvedDonations.length,
            total_requests: donations.length,
            pending_requests: pendingDonations.length,
            recent_requests: pendingDonations,
            recent_donations: donations
        }));
    } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
    } finally {
        setLoading(false);
    }
};

    /* =========================
       Notifications Logic
    ========================= */
    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications/my/");
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get("/notifications/unread-count/");
            setUnreadCount(res.data.unread);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read/`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            fetchUnreadCount();
        } catch (err) {
            console.error(err);
        }
    };

    /* =========================
       Admin Actions
    ========================= */
    const handleAction = async (id, action) => {
    try {
        if (action === "delete") {
            if (!window.confirm("Are you sure?")) return;
            await api.delete(`/donations/${id}/`);
            toast.success("Donation deleted");
        } else if (action === "approve") {
            await api.patch(`/donations/${id}/`, {
                is_completed: true,
                approved_by_ngo: true
            });
            toast.success("Donation approved");
        } else if (action === "reject") {
            await api.patch(`/donations/${id}/`, {
                is_completed: false,
                approved_by_ngo: false
            });
            toast.success("Donation rejected");
        }

        fetchData();
    } catch (error) {
        console.error("ACTION ERROR:", error.response?.data || error.message);
        toast.error("Action failed");
    }
};

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString() : "N/A";

    if (loading) return <p className="text-gray-400">Loading dashboard...</p>;

    return (
        <div className="text-white space-y-8 relative">

            {/* 🔔 Notification Bell */}
            <div className="absolute top-0 right-0">
                <div
                    className="relative cursor-pointer text-2xl"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    🔔
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-black/90 border border-white/20 rounded-xl p-4 z-50">
                        <h4 className="font-semibold mb-2">Notifications</h4>

                        {notifications.length === 0 && (
                            <p className="text-gray-400 text-sm">No notifications</p>
                        )}

                        {notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => !n.is_read && markAsRead(n.id)}
                                className={`p-2 mb-2 rounded cursor-pointer text-sm
                                    ${n.is_read
                                        ? "text-gray-400"
                                        : "font-bold bg-white/10"
                                    }`}
                            >
                                {n.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* =========================
               Title
            ========================= */}
            <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Dashboard Overview
            </motion.h1>

            {/* =========================
               Stats Cards
            ========================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard icon={<FaDonate />} label="Total Donations" value={stats.total_donations} color="text-pink-400" />
                <StatCard icon={<FaUsers />} label="Registered Users" value={stats.total_users} color="text-blue-400" />
                <StatCard icon={<FaHandHoldingHeart />} label="Active Cases" value={stats.active_cases} color="text-green-400" />
                <StatCard icon={<FaClipboardList />} label="Total Requests" value={stats.total_requests} color="text-emerald-400" />
                <StatCard icon={<FaClipboardList />} label="Pending Requests" value={stats.pending_requests} color="text-yellow-400" />
            </div>

            {/* =========================
               Recent Pending Requests
            ========================= */}
            <DataTable
                title="Recent Pending Requests"
                headers={["Name", "Phone", "Category", "Status", "Date", "Actions"]}
                data={stats.recent_requests}
                emptyText="No pending requests"
               renderRow={(req) => (
    <>
        <td>{req.guest_name || req.title || "N/A"}</td>
        <td>
            {req.guest_phone
                ? <a href={`tel:${req.guest_phone}`} className="text-blue-400">{req.guest_phone}</a>
                : "N/A"}
        </td>
        <td>{req.donation_type || "N/A"}</td>
        <td>{req.is_completed ? "COMPLETED" : "PENDING"}</td>
        <td>{formatDate(req.created_at)}</td>
        <td className="flex gap-2">
            <button onClick={() => handleAction(req.id, "approve")}><FaCheck /></button>
            <button onClick={() => handleAction(req.id, "reject")}><FaTimes /></button>
            <button onClick={() => handleAction(req.id, "delete")}><FaTrash /></button>
        </td>
    </>
)}
            />
        </div>
    );
}

/* =========================
   Reusable Components
========================= */

function StatCard({ icon, label, value, color }) {
    return (
        <div className="bg-white/10 p-6 rounded-xl flex items-center gap-4">
            <div className={`text-4xl ${color}`}>{icon}</div>
            <div>
                <p className="text-gray-300 text-sm">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function DataTable({ title, headers, data, renderRow, emptyText }) {
    return (
        <div className="bg-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        {headers.map(h => <th key={h}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data?.length ? data.map(row => (
                        <tr key={row.id}>{renderRow(row)}</tr>
                    )) : (
                        <tr>
                            <td colSpan={headers.length} className="text-center text-gray-400">
                                {emptyText}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
