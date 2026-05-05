import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    getAllAidRequestsAdminApi,
    updateAidRequestStatusApi,
    deleteAidRequestAdminApi,
} from "../api";

export default function AidRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [adminNotes, setAdminNotes] = useState({});
    const [updatingId, setUpdatingId] = useState(null);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const response = await getAllAidRequestsAdminApi();
            setRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to load aid requests:", error);

            if (error.response?.status === 403) {
                toast.error("Only admins can view aid requests.");
            } else if (error.response?.status === 401) {
                toast.error("Please login as admin first.");
            } else {
                toast.error("Failed to load aid requests.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const matchesStatus =
                statusFilter === "ALL" || request.status === statusFilter;

            const query = searchQuery.trim().toLowerCase();

            const searchableText = [
                request.id,
                request.title,
                request.description,
                request.category,
                request.urgency_level,
                request.location,
                request.status,
                request.beneficiary_email,
                request.beneficiary_name,
                request.needed_amount,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = !query || searchableText.includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [requests, statusFilter, searchQuery]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-500/15 text-green-300 border-green-500/30";
            case "REJECTED":
                return "bg-red-500/15 text-red-300 border-red-500/30";
            case "COMPLETED":
                return "bg-blue-500/15 text-blue-300 border-blue-500/30";
            default:
                return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
        }
    };

    const getUrgencyStyle = (urgency) => {
        switch (urgency) {
            case "CRITICAL":
                return "bg-red-500/20 text-red-300";
            case "HIGH":
                return "bg-orange-500/20 text-orange-300";
            case "MEDIUM":
                return "bg-yellow-500/20 text-yellow-300";
            default:
                return "bg-blue-500/20 text-blue-300";
        }
    };

    const toNumber = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    };

    const hasAmount = (value) => value !== null && value !== undefined && value !== "";

    const formatAmount = (value) =>
        hasAmount(value) ? `${toNumber(value).toFixed(2)} JOD` : "Not specified";

    const getFundingPercentage = (request) =>
        Math.min(Math.max(toNumber(request.funding_percentage), 0), 100);

    const isFullyFunded = (request) =>
        request.is_fully_funded ||
        request.status === "COMPLETED" ||
        (hasAmount(request.remaining_amount) && toNumber(request.remaining_amount) <= 0);

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);

            await updateAidRequestStatusApi(id, {
                status,
                admin_note: adminNotes[id] || "",
            });

            toast.success(`Aid request ${status.toLowerCase()} successfully.`);
            await loadRequests();
        } catch (error) {
            console.error("Failed to update aid request:", error);
            toast.error("Failed to update aid request.");
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteRequest = async (id) => {
        if (!confirm("Are you sure you want to delete this aid request?")) {
            return;
        }

        try {
            setUpdatingId(id);
            await deleteAidRequestAdminApi(id);
            toast.success("Aid request deleted.");
            await loadRequests();
        } catch (error) {
            console.error("Failed to delete aid request:", error);
            toast.error("Failed to delete aid request.");
        } finally {
            setUpdatingId(null);
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter((r) => r.status === "PENDING").length,
        approved: requests.filter((r) => r.status === "APPROVED").length,
        rejected: requests.filter((r) => r.status === "REJECTED").length,
        completed: requests.filter((r) => r.status === "COMPLETED").length,
    };

    return (
        <div className="space-y-6 text-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold">Aid Requests Management</h1>
                <p className="mt-2 text-gray-400">
                    Review beneficiary aid requests before they become visible for support.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                    <p className="text-sm text-gray-400">Total Requests</p>
                    <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                </div>

                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
                    <p className="text-sm text-yellow-200">Pending</p>
                    <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                    <p className="text-sm text-green-200">Approved</p>
                    <p className="mt-2 text-3xl font-bold">{stats.approved}</p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                    <p className="text-sm text-red-200">Rejected</p>
                    <p className="mt-2 text-3xl font-bold">{stats.rejected}</p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                    <p className="text-sm text-blue-200">Completed</p>
                    <p className="mt-2 text-3xl font-bold">{stats.completed}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Search aid requests
                        </label>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, beneficiary, category, location..."
                            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Filter by status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400"
                        >
                            <option className="bg-slate-950" value="ALL">
                                All Requests
                            </option>
                            <option className="bg-slate-950" value="PENDING">
                                Pending
                            </option>
                            <option className="bg-slate-950" value="APPROVED">
                                Approved
                            </option>
                            <option className="bg-slate-950" value="REJECTED">
                                Rejected
                            </option>
                            <option className="bg-slate-950" value="COMPLETED">
                                Completed
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Requests */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                {loading ? (
                    <p className="text-gray-300">Loading aid requests...</p>
                ) : filteredRequests.length === 0 ? (
                    <div className="py-10 text-center text-gray-300">
                        <p className="text-lg font-semibold">No aid requests found</p>
                        <p className="mt-1 text-sm text-gray-400">
                            Try changing the search or status filter.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                            >
                                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                    <div className="flex-1">
                                        <div className="mb-3 flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-bold">
                                                {request.title}
                                            </h2>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                                    request.status
                                                )}`}
                                            >
                                                {request.status}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${getUrgencyStyle(
                                                    request.urgency_level
                                                )}`}
                                            >
                                                {request.urgency_level}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-6 text-gray-300">
                                            {request.description}
                                        </p>

                                        <div className="mt-4 grid gap-2 text-sm text-gray-400 md:grid-cols-2">
                                            <p>
                                                Beneficiary:{" "}
                                                <span className="text-gray-200">
                                                    {request.beneficiary_name ||
                                                        request.beneficiary_email ||
                                                        "Unknown"}
                                                </span>
                                            </p>

                                            <p>
                                                Email:{" "}
                                                <span className="text-gray-200">
                                                    {request.beneficiary_email || "N/A"}
                                                </span>
                                            </p>

                                            <p>
                                                Category:{" "}
                                                <span className="text-gray-200">
                                                    {request.category}
                                                </span>
                                            </p>

                                            <p>
                                                Location:{" "}
                                                <span className="text-gray-200">
                                                    {request.location}
                                                </span>
                                            </p>

                                            <p>
                                                Needed Amount:{" "}
                                                <span className="text-gray-200">
                                                    {request.needed_amount
                                                        ? `${request.needed_amount} JOD`
                                                        : "Not specified"}
                                                </span>
                                            </p>

                                            <p>
                                                Raised:{" "}
                                                <span className="text-gray-200">
                                                    {formatAmount(request.raised_amount)}
                                                </span>
                                            </p>

                                            <p>
                                                Remaining:{" "}
                                                <span className="text-gray-200">
                                                    {formatAmount(request.remaining_amount)}
                                                </span>
                                            </p>

                                            <p>
                                                Funding:{" "}
                                                <span className="text-gray-200">
                                                    {getFundingPercentage(request).toFixed(2)}%
                                                </span>
                                            </p>

                                            <p>
                                                Created:{" "}
                                                <span className="text-gray-200">
                                                    {request.created_at
                                                        ? new Date(
                                                              request.created_at
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-white">
                                                    Funding Progress
                                                </p>
                                                {isFullyFunded(request) && (
                                                    <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
                                                        Completed / Fully Funded
                                                    </span>
                                                )}
                                            </div>
                                            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{
                                                        width: `${getFundingPercentage(request)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {request.admin_note && (
                                            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
                                                <span className="font-semibold text-white">
                                                    Existing admin note:
                                                </span>{" "}
                                                {request.admin_note}
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <label className="mb-2 block text-sm text-gray-300">
                                                Admin note
                                            </label>
                                            <textarea
                                                value={adminNotes[request.id] || ""}
                                                onChange={(e) =>
                                                    setAdminNotes((prev) => ({
                                                        ...prev,
                                                        [request.id]: e.target.value,
                                                    }))
                                                }
                                                rows="2"
                                                placeholder="Optional note for this request..."
                                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex min-w-[170px] flex-col gap-3">
                                        <button
                                            onClick={() =>
                                                updateStatus(request.id, "APPROVED")
                                            }
                                            disabled={updatingId === request.id}
                                            className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateStatus(request.id, "REJECTED")
                                            }
                                            disabled={updatingId === request.id}
                                            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                                        >
                                            Reject
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateStatus(request.id, "COMPLETED")
                                            }
                                            disabled={updatingId === request.id}
                                            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            Mark Completed
                                        </button>

                                        <button
                                            onClick={() => deleteRequest(request.id)}
                                            disabled={updatingId === request.id}
                                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
