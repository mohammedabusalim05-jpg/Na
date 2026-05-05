import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function VolunteerDashboard() {
    const [campaigns, setCampaigns] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const [campaignsRes, applicationsRes] = await Promise.all([
                api.get("/campaigns/approved/"),
                api.get("/volunteers/my-applications/"),
            ]);

            setCampaigns(campaignsRes.data);
            setApplications(applicationsRes.data);
        } catch (error) {
            console.error("Failed to load volunteer dashboard:", error);

            if (error.response?.status === 401) {
                toast.error("Please login first.");
            } else if (error.response?.status === 403) {
                toast.error("Only volunteers can access this dashboard.");
            } else {
                toast.error("Failed to load volunteer dashboard.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const hasApplied = (campaignId) => {
        return applications.some((app) => app.campaign_id === campaignId);
    };

    const getApplicationForCampaign = (campaignId) => {
        return applications.find((app) => app.campaign_id === campaignId);
    };

    const applyToCampaign = async (campaignId) => {
        try {
            setApplyingId(campaignId);

            await api.post("/volunteers/apply/", {
                campaign_id: campaignId,
            });

            toast.success("Application submitted successfully.");
            await loadData();
        } catch (error) {
            console.error("Failed to apply:", error);

            const message =
                error.response?.data?.error ||
                "Failed to apply to this campaign.";

            toast.error(message);
        } finally {
            setApplyingId(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-700";
            case "REJECTED":
                return "bg-red-100 text-red-700";
            case "ACTIVE":
                return "bg-blue-100 text-blue-700";
            case "COMPLETED":
                return "bg-purple-100 text-purple-700";
            case "CANCELLED":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const formatStatus = (status) => {
        if (status === "UNDER_REVIEW" || status === "CREATED") {
            return "PENDING";
        }

        return status;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-10 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold">
                            Volunteer Dashboard
                        </h1>
                        <p className="mt-2 text-gray-300">
                            View volunteering campaigns, apply to opportunities, and track your application status.
                        </p>
                    </div>

                    <Link
                        to="/categorization"
                        className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-bold text-white shadow-lg hover:bg-emerald-600"
                    >
                        Donations Page
                    </Link>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-8 text-gray-300">
                        Loading volunteer dashboard...
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Campaigns */}
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    Available Volunteering Campaigns
                                </h2>
                            </div>

                            {campaigns.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-8 text-gray-300">
                                    No approved volunteering campaigns are available yet.
                                </div>
                            ) : (
                                <div className="grid gap-5">
                                    {campaigns.map((campaign) => {
                                        const application = getApplicationForCampaign(campaign.id);
                                        const alreadyApplied = hasApplied(campaign.id);

                                        return (
                                            <div
                                                key={campaign.id}
                                                className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur"
                                            >
                                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold">
                                                            {campaign.title}
                                                        </h3>

                                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                                            {campaign.description || "No description provided."}
                                                        </p>

                                                        <p className="mt-3 text-xs text-gray-400">
                                                            Posted by: {campaign.ngo || "NGO"}
                                                        </p>
                                                    </div>

                                                    {alreadyApplied ? (
                                                        <span
                                                            className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                                                                application.status
                                                            )}`}
                                                        >
                                                            {formatStatus(application.status)}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => applyToCampaign(campaign.id)}
                                                            disabled={applyingId === campaign.id}
                                                            className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {applyingId === campaign.id
                                                                ? "Applying..."
                                                                : "Apply"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* My Applications */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold">
                                My Applications
                            </h2>

                            {applications.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-gray-300">
                                    You have not applied to any campaigns yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg"
                                        >
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <h3 className="font-bold">
                                                    {app.campaign}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                                        app.status
                                                    )}`}
                                                >
                                                    {formatStatus(app.status)}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-6 text-gray-300">
                                                {app.campaign_description || "No description provided."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
