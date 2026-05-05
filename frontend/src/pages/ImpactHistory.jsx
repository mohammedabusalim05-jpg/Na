import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";

export default function ImpactHistory() {
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState([]);
    const [volunteerApplications, setVolunteerApplications] = useState([]);

    const role = (localStorage.getItem("role") || "").toUpperCase();

    const loadHistory = async () => {
        try {
            setLoading(true);

            const requests = [
                api.get("/donations/my/"),
            ];

            if (role === "VOLUNTEER") {
                requests.push(api.get("/volunteers/my-applications/"));
            }

            const responses = await Promise.allSettled(requests);

            if (responses[0].status === "fulfilled") {
                const donationData = responses[0].value.data || [];
                setDonations(Array.isArray(donationData) ? donationData : []);
            } else {
                console.error("Failed to load my donations:", responses[0].reason);
                toast.error("Could not load your donation history.");
            }

            if (role === "VOLUNTEER" && responses[1]?.status === "fulfilled") {
                const volunteerData = responses[1].value.data || [];
                setVolunteerApplications(Array.isArray(volunteerData) ? volunteerData : []);
            }
        } catch (error) {
            console.error("Failed to load history:", error);
            toast.error("Failed to load your history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const getStatusStyle = (status) => {
        const finalStatus = String(status || "").toUpperCase();

        if (["APPROVED", "ACCEPTED", "COMPLETED"].includes(finalStatus)) {
            return "bg-green-100 text-green-700";
        }

        if (["REJECTED", "CANCELLED"].includes(finalStatus)) {
            return "bg-red-100 text-red-700";
        }

        if (["PENDING", "UNDER_REVIEW", "CREATED"].includes(finalStatus)) {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    const formatStatus = (status) => {
        if (!status) return "UNKNOWN";

        if (status === "UNDER_REVIEW" || status === "CREATED") {
            return "PENDING";
        }

        return String(status).toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) return "No date";

        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return "No date";
        }
    };

    const isCaseDonation = (donation) =>
        Boolean(donation.aid_request || donation.aid_request_title);

    const getDonationStatus = (donation) =>
        donation.status || (donation.is_completed ? "COMPLETED" : "PENDING");

    const getNgoName = (donation) =>
        donation.assigned_ngo_name ||
        donation.assigned_ngo_email ||
        "Nakhwa partner NGO";

    const getGeneralDonationTitle = (donation) =>
        donation.title ||
        donation.donation_type ||
        donation.category ||
        "Donation";

    const getDonationAmount = (donation) =>
        donation.amount ? `${donation.amount} JOD` : "Not specified";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold">My Impact History</h1>
                    <p className="mt-2 text-gray-300">
                        Track your donations, volunteering applications, and contribution history in Nakhwa.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl backdrop-blur">
                        Loading your history...
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Donation History */}
                        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <div className="mb-5">
                                <h2 className="text-2xl font-bold">Donation History</h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Only donations linked to your logged-in account are shown here.
                                </p>
                            </div>

                            {donations.length === 0 ? (
                                <div className="rounded-2xl bg-slate-950/60 p-5 text-gray-300">
                                    No donation history found for this account yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {donations.map((donation, index) => {
                                        const caseDonation = isCaseDonation(donation);
                                        const donationStatus = getDonationStatus(donation);

                                        return (
                                            <div
                                                key={donation.id || index}
                                                className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                                                                caseDonation
                                                                    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                                                                    : "border-blue-500/30 bg-blue-500/15 text-blue-300"
                                                            }`}
                                                        >
                                                            {caseDonation ? "Case Donation" : "General Donation"}
                                                        </span>

                                                        <h3 className="mt-3 font-bold">
                                                            {caseDonation
                                                                ? donation.aid_request_title ||
                                                                  donation.title ||
                                                                  "Approved aid case"
                                                                : getGeneralDonationTitle(donation)}
                                                        </h3>

                                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                                            {donation.description ||
                                                                donation.details ||
                                                                "No description provided."}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                                            donationStatus
                                                        )}`}
                                                    >
                                                        {formatStatus(donationStatus)}
                                                    </span>
                                                </div>

                                                <div className="mt-4 grid gap-2 text-sm text-gray-400 sm:grid-cols-2">
                                                    <p>
                                                        Amount:{" "}
                                                        <span className="text-gray-200">
                                                            {getDonationAmount(donation)}
                                                        </span>
                                                    </p>

                                                    <p>
                                                        Date:{" "}
                                                        <span className="text-gray-200">
                                                            {formatDate(donation.created_at)}
                                                        </span>
                                                    </p>

                                                    {caseDonation ? (
                                                        <>
                                                            <p>
                                                                Case:{" "}
                                                                <span className="text-gray-200">
                                                                    {donation.aid_request_title ||
                                                                        "Approved aid case"}
                                                                </span>
                                                            </p>

                                                            <p>
                                                                NGO:{" "}
                                                                <span className="text-gray-200">
                                                                    {getNgoName(donation)}
                                                                </span>
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>
                                                                Type:{" "}
                                                                <span className="text-gray-200">
                                                                    {donation.donation_type ||
                                                                        donation.type ||
                                                                        "Not specified"}
                                                                </span>
                                                            </p>

                                                            {donation.location && (
                                                                <p>
                                                                    Location:{" "}
                                                                    <span className="text-gray-200">
                                                                        {donation.location}
                                                                    </span>
                                                                </p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Volunteer History */}
                        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <div className="mb-5">
                                <h2 className="text-2xl font-bold">Volunteering History</h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Campaigns you applied to and your application status.
                                </p>
                            </div>

                            {role !== "VOLUNTEER" ? (
                                <div className="rounded-2xl bg-slate-950/60 p-5 text-gray-300">
                                    Volunteering history is available for volunteer accounts.
                                </div>
                            ) : volunteerApplications.length === 0 ? (
                                <div className="rounded-2xl bg-slate-950/60 p-5 text-gray-300">
                                    No volunteering applications found yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {volunteerApplications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-bold">
                                                        {app.campaign || "Volunteering Campaign"}
                                                    </h3>

                                                    <p className="mt-2 text-sm leading-6 text-gray-300">
                                                        {app.campaign_description ||
                                                            "No description provided."}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                                        app.status
                                                    )}`}
                                                >
                                                    {formatStatus(app.status)}
                                                </span>
                                            </div>

                                            <p className="mt-4 text-sm text-gray-400">
                                                Applied on:{" "}
                                                <span className="text-gray-200">
                                                    {formatDate(app.created_at)}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
