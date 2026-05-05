import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function ApprovedAidCases() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [urgencyFilter, setUrgencyFilter] = useState("ALL");

    const loadCases = async () => {
        try {
            setLoading(true);
            const res = await api.get("/cases/");
            setCases(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to load approved aid cases:", error);

            if (error.response?.status === 401) {
                toast.error("Please login first.");
            } else {
                toast.error("Failed to load approved aid cases.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();
    }, []);

    const categories = [
        "ALL",
        "MEDICAL",
        "FOOD",
        "HOUSING",
        "EDUCATION",
        "EMERGENCY",
        "FINANCIAL",
        "OTHER",
    ];

    const urgencyLevels = ["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

    const filteredCases = useMemo(() => {
        return cases.filter((item) => {
            const query = searchQuery.trim().toLowerCase();

            const searchableText = [
                item.title,
                item.description,
                item.category,
                item.urgency_level,
                item.location,
                item.needed_amount,
                item.beneficiary_name,
                item.beneficiary_email,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = !query || searchableText.includes(query);
            const matchesCategory =
                categoryFilter === "ALL" || item.category === categoryFilter;
            const matchesUrgency =
                urgencyFilter === "ALL" || item.urgency_level === urgencyFilter;

            return matchesSearch && matchesCategory && matchesUrgency;
        });
    }, [cases, searchQuery, categoryFilter, urgencyFilter]);

    const getUrgencyStyle = (urgency) => {
        switch (urgency) {
            case "CRITICAL":
                return "bg-red-500/20 text-red-300 border-red-500/30";
            case "HIGH":
                return "bg-orange-500/20 text-orange-300 border-orange-500/30";
            case "MEDIUM":
                return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
            default:
                return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        }
    };

    const getNgoName = (item) =>
        item.approved_by_ngo_name ||
        item.approved_by_ngo_email ||
        "Nakhwa partner NGO";

    const toNumber = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    };

    const formatAmount = (value) =>
        value !== null && value !== undefined && value !== ""
            ? `${toNumber(value).toFixed(2)} JOD`
            : "Not specified";

    const getFundingPercentage = (item) =>
        Math.min(Math.max(toNumber(item.funding_percentage), 0), 100);

    const isFullyFunded = (item) =>
        item.is_fully_funded ||
        (item.remaining_amount !== null &&
            item.remaining_amount !== undefined &&
            item.remaining_amount !== "" &&
            toNumber(item.remaining_amount) <= 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                        Approved Humanitarian Cases
                    </div>

                    <h1 className="text-4xl font-extrabold md:text-5xl">
                        Approved Aid Cases
                    </h1>

                    <p className="mt-3 max-w-3xl text-gray-300">
                        Browse verified aid requests approved by the admin team. These cases are ready for support from donors, NGOs, and volunteers.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Search cases
                            </label>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, location, category..."
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category} className="bg-slate-950">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Urgency
                            </label>
                            <select
                                value={urgencyFilter}
                                onChange={(e) => setUrgencyFilter(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400"
                            >
                                {urgencyLevels.map((urgency) => (
                                    <option key={urgency} value={urgency} className="bg-slate-950">
                                        {urgency}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-gray-300">
                        Loading approved cases...
                    </div>
                ) : filteredCases.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center text-gray-300">
                        <p className="text-xl font-bold">No approved cases found</p>
                        <p className="mt-2 text-sm text-gray-400">
                            Try changing your filters, or wait until the admin approves new aid requests.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredCases.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur transition hover:border-emerald-400/40 hover:bg-white/15"
                            >
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                                        {item.category}
                                    </span>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getUrgencyStyle(
                                            item.urgency_level
                                        )}`}
                                    >
                                        {item.urgency_level}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-white">
                                    {item.title}
                                </h2>

                                <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-300">
                                    {item.description}
                                </p>

                                <div className="mt-5 space-y-2 text-sm text-gray-400">
                                    <p>
                                        Location:{" "}
                                        <span className="text-gray-200">
                                            {item.location || "Not specified"}
                                        </span>
                                    </p>

                                    <p>
                                        Needed Amount:{" "}
                                        <span className="text-gray-200">
                                            {item.needed_amount
                                                ? `${item.needed_amount} JOD`
                                                : "Not specified"}
                                        </span>
                                    </p>

                                    <p>
                                        Beneficiary:{" "}
                                        <span className="text-gray-200">
                                            {item.beneficiary_name ||
                                                item.beneficiary_email ||
                                                "Verified beneficiary"}
                                        </span>
                                    </p>

                                    {item.beneficiary_name && item.beneficiary_email && (
                                        <p>
                                            Beneficiary Email:{" "}
                                            <span className="text-gray-200">
                                                {item.beneficiary_email}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-white">
                                            Funding Progress
                                        </p>
                                        {isFullyFunded(item) && (
                                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                                                Fully Funded
                                            </span>
                                        )}
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-emerald-500"
                                            style={{
                                                width: `${getFundingPercentage(item)}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-3 grid gap-2 text-sm text-gray-400">
                                        <p>
                                            Raised:{" "}
                                            <span className="text-gray-200">
                                                {formatAmount(item.raised_amount)}
                                            </span>
                                        </p>
                                        <p>
                                            Remaining:{" "}
                                            <span className="text-gray-200">
                                                {formatAmount(item.remaining_amount)}
                                            </span>
                                        </p>
                                        <p>
                                            Funding:{" "}
                                            <span className="text-gray-200">
                                                {getFundingPercentage(item).toFixed(2)}%
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                                    <span className="font-semibold text-white">
                                        Managed by:
                                    </span>{" "}
                                    {getNgoName(item)}
                                </div>

                                {item.admin_note && (
                                    <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-gray-300">
                                        <span className="font-semibold text-white">
                                            Admin note:
                                        </span>{" "}
                                        {item.admin_note}
                                    </div>
                                )}

                                <Link
                                    to={`/support-case/${item.id}`}
                                    className="mt-6 block rounded-xl bg-emerald-500 px-5 py-3 text-center font-bold text-white shadow-lg hover:bg-emerald-600"
                                >
                                    Support This Case
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
