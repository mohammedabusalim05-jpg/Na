import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    createAidRequestApi,
    getMyAidRequestsApi,
} from "../api";

export default function RequestAid() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "MEDICAL",
        urgency_level: "MEDIUM",
        location: "",
        needed_amount: "",
    });

    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(true);

    const categories = [
        { value: "MEDICAL", label: "Medical Help" },
        { value: "FOOD", label: "Food Support" },
        { value: "HOUSING", label: "Housing Support" },
        { value: "EDUCATION", label: "Education Support" },
        { value: "EMERGENCY", label: "Emergency Help" },
        { value: "FINANCIAL", label: "Financial Support" },
        { value: "OTHER", label: "Other" },
    ];

    const urgencyLevels = [
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
        { value: "CRITICAL", label: "Critical" },
    ];

    const loadMyRequests = async () => {
        try {
            setLoadingRequests(true);
            const response = await getMyAidRequestsApi();
            setMyRequests(response.data);
        } catch (error) {
            console.error("Failed to load aid requests:", error);

            if (error.response?.status === 401) {
                toast.error("Please login first.");
            } else if (error.response?.status === 403) {
                toast.error("Only beneficiaries can view aid requests.");
            } else {
                toast.error("Could not load your aid requests.");
            }
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        loadMyRequests();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.error("Title is required.");
            return false;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required.");
            return false;
        }

        if (!formData.location.trim()) {
            toast.error("Location is required.");
            return false;
        }

        if (formData.needed_amount && Number(formData.needed_amount) < 0) {
            toast.error("Needed amount cannot be negative.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = {
                ...formData,
                needed_amount: formData.needed_amount || null,
            };

            await createAidRequestApi(payload);

            toast.success("Aid request submitted successfully.");

            setFormData({
                title: "",
                description: "",
                category: "MEDICAL",
                urgency_level: "MEDIUM",
                location: "",
                needed_amount: "",
            });

            await loadMyRequests();
        } catch (error) {
            console.error("Failed to create aid request:", error);

            if (error.response?.status === 403) {
                toast.error("Only beneficiaries can submit aid requests.");
            } else if (error.response?.status === 401) {
                toast.error("Please login first.");
            } else {
                toast.error("Failed to submit aid request.");
            }
        } finally {
            setLoading(false);
        }
    };

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

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20";

    const labelClass = "mb-1 block text-sm font-semibold text-gray-300";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                        Beneficiary Aid Request
                    </div>

                    <h1 className="text-4xl font-extrabold md:text-5xl">
                        Request Aid
                    </h1>

                    <p className="mt-3 max-w-3xl text-gray-300">
                        Submit a humanitarian aid request. The admin team will review
                        your case before it becomes visible for support.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Form */}
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                Submit New Aid Request
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Fill in the case details clearly so the admin can review it.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className={labelClass}>Request Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Example: Need medical help for surgery"
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category.value}
                                                value={category.value}
                                                className="bg-slate-950"
                                            >
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Urgency Level</label>
                                    <select
                                        name="urgency_level"
                                        value={formData.urgency_level}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        {urgencyLevels.map((level) => (
                                            <option
                                                key={level.value}
                                                value={level.value}
                                                className="bg-slate-950"
                                            >
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Example: Amman"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Needed Amount</label>
                                    <input
                                        type="number"
                                        name="needed_amount"
                                        value={formData.needed_amount}
                                        onChange={handleChange}
                                        placeholder="Example: 500"
                                        min="0"
                                        step="0.01"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Explain the case clearly..."
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Submitting..." : "Submit Aid Request"}
                            </button>
                        </form>
                    </div>

                    {/* My Requests */}
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">My Aid Requests</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Track the review status of your submitted cases.
                            </p>
                        </div>

                        {loadingRequests ? (
                            <div className="rounded-2xl bg-slate-950/60 p-5 text-gray-300">
                                Loading your requests...
                            </div>
                        ) : myRequests.length === 0 ? (
                            <div className="rounded-2xl bg-slate-950/60 p-6 text-gray-300">
                                <p className="font-semibold">No aid requests yet</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Submit your first request using the form on the left.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <h3 className="font-bold text-white">
                                                {request.title}
                                            </h3>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                                    request.status
                                                )}`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-6 text-gray-300">
                                            {request.description}
                                        </p>

                                        <div className="mt-4 grid gap-2 text-sm text-gray-400 sm:grid-cols-2">
                                            <p>
                                                Category:{" "}
                                                <span className="text-gray-200">
                                                    {request.category}
                                                </span>
                                            </p>

                                            <p>
                                                Urgency:{" "}
                                                <span className="text-gray-200">
                                                    {request.urgency_level}
                                                </span>
                                            </p>

                                            <p>
                                                Location:{" "}
                                                <span className="text-gray-200">
                                                    {request.location}
                                                </span>
                                            </p>

                                            <p>
                                                Amount:{" "}
                                                <span className="text-gray-200">
                                                    {request.needed_amount
                                                        ? `${request.needed_amount} JOD`
                                                        : "Not specified"}
                                                </span>
                                            </p>
                                        </div>

                                        {request.admin_note && (
                                            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
                                                <span className="font-semibold text-white">
                                                    Admin note:
                                                </span>{" "}
                                                {request.admin_note}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}