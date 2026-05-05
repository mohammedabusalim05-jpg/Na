import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/index";
import toast from "react-hot-toast";

export default function DonationsDashboard() {
    const [donations, setDonations] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    // =========================
    // FETCH DONATIONS (FIXED)
    // =========================
    const fetchDonations = async () => {
        try {
            const res = await api.get("/donations/");

            console.log("DASHBOARD DONATIONS:", res.data); // للتأكد
            setDonations(res.data);
            setLoading(false);
        } catch (error) {
            console.error(
                "FETCH DONATIONS ERROR:",
                error.response || error
            );
            toast.error("Failed to load donations");
            setLoading(false);
        }
    };

    // =========================
    // DELETE DONATION
    // =========================
    const deleteDonation = async (id) => {
        if (!confirm("Are you sure you want to delete this donation?")) return;

        try {
            await api.delete(`/donations/${id}/`);

            setDonations(donations.filter((d) => d.id !== id));
            toast.success("Donation deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete donation");
        }
    };

    // =========================
    // TOGGLE STATUS
    // =========================
    const toggleStatus = async (id, currentStatus) => {
        try {
            await api.patch(
                `/donations/${id}/`,
                { is_completed: !currentStatus }
            );

            setDonations(
                donations.map((d) =>
                    d.id === id
                        ? { ...d, is_completed: !currentStatus }
                        : d
                )
            );

            toast.success("Status updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    if (loading) {
        return (
            <p className="text-center text-gray-300">
                Loading donations...
            </p>
        );
    }

    // =========================
    // FILTER + SEARCH
    // =========================
    const filteredDonations = donations.filter((d) => {
        const titleSafe = d.title ? d.title.toLowerCase() : "";
        const matchesSearch = titleSafe.includes(search.toLowerCase());
        const matchesFilter =
            filter === "all" || d.donation_type === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="text-white">

            <h1 className="text-3xl font-bold mb-4">All Donations</h1>

            {/* FILTER BAR */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 w-64"
                />

                <select
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white bg-slate-800"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all" className="text-black">All Types</option>

                    <option value="blood" className="text-black">Blood Donation</option>
                    <option value="organ" className="text-black">Organ Donation</option>
                    <option value="money" className="text-black">Financial Donation</option>
                    <option value="food" className="text-black">Food Donation</option>
                    <option value="adahi" className="text-black">Adahi (Sacrifice)</option>

                    <option value="clothes" className="text-black">Clothes Donation</option>
                    <option value="furniture" className="text-black">Furniture Donation</option>
                    <option value="medical" className="text-black">Medical Equipment</option>
                    <option value="household" className="text-black">Household Items</option>
                    <option value="water" className="text-black">Clean Water</option>

                    <option value="baby" className="text-black">Baby Supplies</option>
                    <option value="toys" className="text-black">Toys Donation</option>
                    <option value="education" className="text-black">Education Support</option>
                    <option value="electronics" className="text-black">Electronics</option>
                    <option value="cleaning" className="text-black">Cleaning Supplies</option>

                    <option value="medicine_support" className="text-black">Medicine Support</option>
                    <option value="pets" className="text-black">Pet Support & Adoption</option>
                    <option value="volunteer" className="text-black">Volunteer Time</option>
                    <option value="skills" className="text-black">Professional Help</option>

                    <option value="families" className="text-black">Family Support</option>
                    <option value="refugees" className="text-black">Refugee Support</option>
                    <option value="orphans" className="text-black">Orphan Sponsorship</option>
                    <option value="charity_general" className="text-black">General Charity</option>
                    <option value="food_coupons" className="text-black">Food Coupons</option>

                </select>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/20 text-gray-300">
                            <th className="p-3">ID</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredDonations.map((donation) => (
                            <tr
                                key={donation.id}
                                className="border-b border-white/10"
                            >
                                <td className="p-3">{donation.id}</td>
                                <td className="p-3 font-semibold">
                                    {donation.title}
                                </td>
                                <td className="p-3">
                                    {donation.donation_type}
                                </td>
                                <td className="p-3">
                                    {donation.user_details
                                        ? donation.user_details.name
                                        : donation.guest_name || "Guest"}
                                </td>
                                <td className="p-3">
                                    {new Date(
                                        donation.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() =>
                                            toggleStatus(
                                                donation.id,
                                                donation.is_completed
                                            )
                                        }
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${donation.is_completed
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-yellow-500/20 text-yellow-300"
                                            }`}
                                    >
                                        {donation.is_completed
                                            ? "Completed"
                                            : "Pending"}
                                    </button>
                                </td>
                                <td className="p-3 flex justify-center gap-3">
                                    <Link
                                        to={`/admin/donations/${donation.id}`}
                                        className="px-3 py-1 bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={() =>
                                            deleteDonation(donation.id)
                                        }
                                        className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredDonations.length === 0 && (
                    <p className="text-center text-gray-400 py-4">
                        No donations found.
                    </p>
                )}
            </div>
        </div>
    );
}
