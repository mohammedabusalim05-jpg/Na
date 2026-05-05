import { useEffect, useState } from "react";
import axios from "axios";
import { getDonationsApi } from "../../api/index";

export default function AdminDashboard() {
    const [donations, setDonations] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        // جلب التبرعات
        getDonationsApi()
            .then((res) => setDonations(res.data))
            .catch((err) => console.error(err));

        // جلب الطلبات المعلقة
        axios
            .get("http://127.0.0.1:8000/api/donation-requests/pending/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            })
            .then((res) => setPendingRequests(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* ===================== */}
            {/* PENDING REQUESTS */}
            {/* ===================== */}
            <h2 className="text-xl font-semibold mb-3">Pending Help Requests</h2>

            <table className="w-full text-left text-sm bg-white/5 rounded-xl overflow-hidden mb-10">
                <thead className="bg-white/10">
                    <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRequests.map((r) => (
                        <tr key={r.id} className="border-b border-white/10">
                            <td className="p-2">{r.name}</td>

                            {/* 📞 رقم الهاتف */}
                            <td className="p-2">
                                <a
                                    href={`tel:${r.phone}`}
                                    className="text-blue-400 hover:underline"
                                >
                                    {r.phone}
                                </a>
                            </td>

                            <td className="p-2">{r.category}</td>

                            <td className="p-2">
                                <span className="px-2 py-1 text-xs rounded bg-yellow-500/20 text-yellow-400">
                                    {r.status.toUpperCase()}
                                </span>
                            </td>

                            <td className="p-2 text-xs text-gray-300">
                                {new Date(r.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}

                    {pendingRequests.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="p-4 text-center text-gray-400"
                            >
                                No pending requests
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ===================== */}
            {/* DONATIONS */}
            {/* ===================== */}
            <h2 className="text-xl font-semibold mb-3">All Donations</h2>

            <table className="w-full text-left text-sm bg-white/5 rounded-xl overflow-hidden">
                <thead className="bg-white/10">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((d) => (
                        <tr key={d.id} className="border-b border-white/10">
                            <td className="p-2">{d.id}</td>
                            <td className="p-2">{d.donation_type}</td>
                            <td className="p-2">{d.title}</td>
                            <td className="p-2 text-xs text-gray-300">
                                {new Date(d.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
