import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

// مهم جداً لإظهار الصورة بشكل صحيح
const BASE_URL = "http://127.0.0.1:8000";

export default function DonationDetails() {
    const { id } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // Fetch specific donation
    // -----------------------------
    const fetchDonation = async () => {
        try {
            const res = await api.get(`/donations/${id}/`);
            setDonation(res.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // -----------------------------
    // Update donation completion status
    // -----------------------------
    const toggleStatus = async () => {
        try {
            const res = await api.patch(`/donations/${id}/`, {
                is_completed: !donation.is_completed,
            });
            setDonation(res.data);
        } catch (error) {
            console.log(error);
            alert("Failed to update status");
        }
    };

    // -----------------------------
    // Approve donation by NGO
    // -----------------------------
    const approveDonation = async () => {
        try {
            const res = await api.patch(`/donations/${id}/`, {
                approved_by_ngo: true,
            });
            setDonation(res.data);
            alert("Donation approved successfully!");
        } catch (err) {
            console.log(err);
            alert("Failed to approve donation");
        }
    };

    useEffect(() => {
        fetchDonation();
    }, [id]);

    if (loading) {
        return <p className="text-gray-300 text-center">Loading details...</p>;
    }

    if (!donation) {
        return <p className="text-red-400 text-center">Donation not found.</p>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white space-y-6 p-6">

            <Link to="/admin/donations" className="text-blue-300 hover:underline">
                ← Back to all donations
            </Link>

            <h1 className="text-3xl font-bold">Donation Details</h1>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl">

                <p><span className="font-bold">ID:</span> {donation.id}</p>
                <p><span className="font-bold">Title:</span> {donation.title}</p>
                <p><span className="font-bold">Type:</span> {donation.donation_type}</p>
                {/* 🔹 User / Guest Info */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Donor Information</h3>
                    {donation.user ? (
                        <>
                            <p><span className="font-bold text-gray-400">Type:</span> Registered User</p>
                            <p><span className="font-bold text-gray-400">Name:</span> {donation.user_details?.name || "N/A"}</p>
                            <p><span className="font-bold text-gray-400">Email:</span> {donation.user_details?.email || "N/A"}</p>
                            <p><span className="font-bold text-gray-400">Phone:</span> {donation.user_details?.phone || "N/A"}</p>
                        </>
                    ) : (
                        <>
                            <p><span className="font-bold text-gray-400">Type:</span> Guest Visitor</p>
                            <p><span className="font-bold text-gray-400">Name:</span> {donation.guest_name || "Anonymous"}</p>
                            <p><span className="font-bold text-gray-400">Email:</span> {donation.guest_email || "N/A"}</p>
                            <p><span className="font-bold text-gray-400">Phone:</span> {donation.guest_phone || "N/A"}</p>
                        </>
                    )}
                </div>
              
                {/* 🔹 Structured Blood Donation Info */}
{donation.donation_type === "blood" && (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
        <h3 className="text-lg font-semibold text-red-300 mb-2">Blood Donation Information</h3>

        <p><span className="font-bold text-gray-400">Date of Birth:</span> {donation.donor_birth_date || "N/A"}</p>
        <p><span className="font-bold text-gray-400">Gender:</span> {donation.donor_gender || "N/A"}</p>
        <p><span className="font-bold text-gray-400">Blood Type:</span> {donation.donor_blood_type || "N/A"}</p>
        <p><span className="font-bold text-gray-400">Last Donation Date:</span> {donation.donor_last_donation_date || "N/A"}</p>
    </div>
)}

                <p><span className="font-bold">Description:</span> {donation.description}</p>

                {/* 🔹 Location */}
                <p>
                    <span className="font-bold">Location:</span>{" "}
                    {donation.location || "Not specified"}
                </p>

                {/* 🔹 Image */}
                {donation.image && (
                    <img
                        src={`${BASE_URL}${donation.image}`}
                        alt="Donation"
                        className="mt-4 rounded-xl max-h-80 object-cover border border-white/20"
                    />
                )}

                <p className="mt-4">
                    <span className="font-bold">Created at:</span>{" "}
                    {new Date(donation.created_at).toLocaleString()}
                </p>

                {/* 🔹 Status */}
                <p className="mt-4">
                    <span className="font-bold">Status:</span>{" "}
                    {donation.is_completed ? (
                        <span className="text-green-400 font-semibold">Completed</span>
                    ) : (
                        <span className="text-yellow-300 font-semibold">Pending</span>
                    )}
                </p>

                {/* 🔹 NGO Approval Status */}
                <p className="mt-2">
                    <span className="font-bold">NGO Approval:</span>{" "}
                    {donation.approved_by_ngo ? (
                        <span className="text-green-400 font-semibold">Approved ✔</span>
                    ) : (
                        <span className="text-red-300 font-semibold">Not Approved</span>
                    )}
                </p>

                {/* 🔘 Toggle Status Button */}
                <button
                    onClick={toggleStatus}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                    Mark as {donation.is_completed ? "Pending" : "Completed"}
                </button>

                {/* 🔘 Approve Donation Button */}
                {!donation.approved_by_ngo && (
                    <button
                        onClick={approveDonation}
                        className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                    >
                        Approve by NGO
                    </button>
                )}
            </div>
        </div>
    );
}
