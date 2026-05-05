import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    getNgoAssignedDonationsApi,
    getNgoMyCasesApi,
    getNgoPendingAidRequestsApi,
    getNgoSupportedCategoriesApi,
    updateNgoSupportedCategoriesApi,
    updateNgoAidRequestStatusApi,
} from "../api";

export default function NGODashboard() {
    const navigate = useNavigate();
    const [pendingCases, setPendingCases] = useState([]);
    const [acceptedCases, setAcceptedCases] = useState([]);
    const [assignedDonations, setAssignedDonations] = useState([]);
    const [supportedCategories, setSupportedCategories] = useState([]);
    const [selectedDonationTypes, setSelectedDonationTypes] = useState([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [savingCategories, setSavingCategories] = useState(false);
    const [categoryMessage, setCategoryMessage] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [ngoNotes, setNgoNotes] = useState({});

    const role = (localStorage.getItem("role") || "").toUpperCase();
    const userName = localStorage.getItem("user_name") || "NGO Employee";

    const loadCases = async () => {
        try {
            setLoading(true);
            const [pendingResponse, acceptedResponse, donationsResponse] = await Promise.all([
                getNgoPendingAidRequestsApi(),
                getNgoMyCasesApi(),
                getNgoAssignedDonationsApi(),
            ]);

            setPendingCases(Array.isArray(pendingResponse.data) ? pendingResponse.data : []);
            setAcceptedCases(Array.isArray(acceptedResponse.data) ? acceptedResponse.data : []);
            setAssignedDonations(
                Array.isArray(donationsResponse.data) ? donationsResponse.data : []
            );
        } catch (error) {
            console.error("Failed to load NGO dashboard cases:", error);

            if (error.response?.status === 403) {
                toast.error("Only NGO employees can access this dashboard.");
            } else if (error.response?.status === 401) {
                toast.error("Please login first.");
            } else {
                toast.error("Failed to load NGO cases.");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadSupportedCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await getNgoSupportedCategoriesApi();
            const categories = Array.isArray(response.data) ? response.data : [];

            setSupportedCategories(categories);
            setSelectedDonationTypes(
                categories
                    .filter((category) => category.is_supported)
                    .map((category) => category.donation_type)
            );
        } catch (error) {
            console.error("Failed to load NGO supported categories:", error);

            if (error.response?.status === 403) {
                toast.error("Only NGO employees can manage donation categories.");
            } else {
                toast.error("Failed to load supported donation categories.");
            }
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        if (role !== "NGO_EMPLOYEE") {
            toast.error("Only NGO employees can access this dashboard.");
            navigate("/");
            return;
        }

        loadCases();
        loadSupportedCategories();
    }, [role, navigate]);

    const stats = useMemo(
        () => ({
            pending: pendingCases.length,
            accepted: acceptedCases.length,
            donations: assignedDonations.length,
        }),
        [pendingCases.length, acceptedCases.length, assignedDonations.length]
    );

    const formatDate = (date) => {
        if (!date) return "No date";

        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return "No date";
        }
    };

    const getDonationStatus = (donation) =>
        donation.status || (donation.is_completed ? "COMPLETED" : "PENDING");

    const getStatusStyle = (status) => {
        const finalStatus = String(status || "").toUpperCase();

        if (["APPROVED", "ACCEPTED", "COMPLETED"].includes(finalStatus)) {
            return "border-green-500/30 bg-green-500/15 text-green-300";
        }

        if (["REJECTED", "CANCELLED"].includes(finalStatus)) {
            return "border-red-500/30 bg-red-500/15 text-red-300";
        }

        return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
    };

    const formatStatus = (status) => {
        if (!status) return "UNKNOWN";
        return String(status).toUpperCase();
    };

    const getDonorName = (donation) =>
        donation.user_details?.name ||
        donation.user_details?.email ||
        donation.guest_name ||
        donation.guest_email ||
        "Unknown donor";

    const filteredSupportedCategories = useMemo(() => {
        const query = categorySearch.trim().toLowerCase();

        if (!query) return supportedCategories;

        return supportedCategories.filter((category) =>
            [
                category.label,
                category.donation_type,
                category.display_name,
                category.description,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
        );
    }, [categorySearch, supportedCategories]);

    const toggleDonationType = (donationType) => {
        setCategoryMessage("");
        setSelectedDonationTypes((prev) =>
            prev.includes(donationType)
                ? prev.filter((item) => item !== donationType)
                : [...prev, donationType]
        );
    };

    const saveSupportedCategories = async () => {
        try {
            setSavingCategories(true);
            setCategoryMessage("");
            await updateNgoSupportedCategoriesApi(selectedDonationTypes);
            await loadSupportedCategories();
            setCategoryMessage("Donation categories saved successfully.");
            toast.success("Donation categories saved successfully.");
        } catch (error) {
            console.error("Failed to save supported categories:", error);
            setCategoryMessage("Failed to save donation categories.");
            toast.error("Failed to save donation categories.");
        } finally {
            setSavingCategories(false);
        }
    };

    const getUrgencyStyle = (urgency) => {
        switch (urgency) {
            case "CRITICAL":
                return "border-red-500/30 bg-red-500/15 text-red-300";
            case "HIGH":
                return "border-orange-500/30 bg-orange-500/15 text-orange-300";
            case "MEDIUM":
                return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
            default:
                return "border-blue-500/30 bg-blue-500/15 text-blue-300";
        }
    };

    const updateCaseStatus = async (caseId, ngoStatus) => {
        try {
            setUpdatingId(caseId);
            await updateNgoAidRequestStatusApi(caseId, {
                ngo_status: ngoStatus,
                ngo_note: ngoNotes[caseId] || "",
            });

            toast.success(
                ngoStatus === "APPROVED"
                    ? "Case accepted successfully."
                    : "Case rejected successfully."
            );

            setNgoNotes((prev) => {
                const next = { ...prev };
                delete next[caseId];
                return next;
            });

            await loadCases();
        } catch (error) {
            console.error("Failed to update NGO case status:", error);
            toast.error(error.response?.data?.error || "Failed to update case.");
        } finally {
            setUpdatingId(null);
        }
    };

    const renderCaseDetails = (item) => (
        <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
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

            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-300">{item.description}</p>

            <div className="mt-4 grid gap-2 text-sm text-gray-400 md:grid-cols-2">
                <p>
                    Location:{" "}
                    <span className="text-gray-200">{item.location || "Not specified"}</span>
                </p>
                <p>
                    Needed Amount:{" "}
                    <span className="text-gray-200">
                        {item.needed_amount ? `${item.needed_amount} JOD` : "Not specified"}
                    </span>
                </p>
                <p>
                    Beneficiary:{" "}
                    <span className="text-gray-200">
                        {item.beneficiary_name || item.beneficiary_email || "Unknown"}
                    </span>
                </p>
                <p>
                    Email:{" "}
                    <span className="text-gray-200">{item.beneficiary_email || "N/A"}</span>
                </p>
            </div>

            {item.admin_note && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-gray-300">
                    <span className="font-semibold text-white">Admin note:</span>{" "}
                    {item.admin_note}
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl space-y-8">
                <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl backdrop-blur">
                    <p className="text-sm font-semibold uppercase text-emerald-300">
                        NGO Employee Dashboard
                    </p>
                    <h1 className="mt-3 text-4xl font-extrabold">Welcome, {userName}</h1>
                    <p className="mt-3 max-w-3xl text-gray-300">
                        Review platform-verified aid cases, accept the cases your NGO can support,
                        and keep track of cases already accepted by your team.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
                            <p className="text-sm text-yellow-200">Waiting for NGO Approval</p>
                            <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                            <p className="text-sm text-emerald-200">My Accepted Cases</p>
                            <p className="mt-2 text-3xl font-bold">{stats.accepted}</p>
                        </div>
                        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                            <p className="text-sm text-blue-200">Assigned Donations</p>
                            <p className="mt-2 text-3xl font-bold">{stats.donations}</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Donation Categories We Support
                            </h2>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
                                Select the donation categories your NGO can receive and manage.
                                Donors will be able to choose your NGO in these donation forms.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={saveSupportedCategories}
                            disabled={categoriesLoading || savingCategories}
                            className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {savingCategories ? "Saving..." : "Save Categories"}
                        </button>
                    </div>

                    <input
                        value={categorySearch}
                        onChange={(event) => setCategorySearch(event.target.value)}
                        placeholder="Search categories..."
                        className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-emerald-400"
                    />

                    {categoryMessage && (
                        <div
                            className={`mt-4 rounded-xl border p-4 text-sm ${
                                categoryMessage.includes("Failed")
                                    ? "border-red-500/30 bg-red-500/15 text-red-200"
                                    : "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
                            }`}
                        >
                            {categoryMessage}
                        </div>
                    )}

                    {categoriesLoading ? (
                        <p className="mt-5 text-gray-300">Loading donation categories...</p>
                    ) : filteredSupportedCategories.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-gray-300">
                            No donation categories match your search.
                        </div>
                    ) : (
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredSupportedCategories.map((category) => {
                                const checked = selectedDonationTypes.includes(
                                    category.donation_type
                                );

                                return (
                                    <label
                                        key={category.donation_type}
                                        className={`cursor-pointer rounded-2xl border p-5 transition ${
                                            checked
                                                ? "border-emerald-400/60 bg-emerald-500/15"
                                                : "border-white/10 bg-slate-950/70 hover:border-emerald-400/40"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    toggleDonationType(category.donation_type)
                                                }
                                                className="mt-1 h-5 w-5 accent-emerald-500"
                                            />
                                            <div>
                                                <p className="font-bold text-white">
                                                    {category.label || category.donation_type}
                                                </p>
                                                <p className="mt-1 text-xs uppercase text-emerald-300">
                                                    {category.donation_type}
                                                </p>
                                                {category.description && (
                                                    <p className="mt-3 text-sm leading-6 text-gray-300">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                    <h2 className="text-2xl font-bold">Cases Waiting for NGO Approval</h2>

                    {loading ? (
                        <p className="mt-5 text-gray-300">Loading cases...</p>
                    ) : pendingCases.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-gray-300">
                            No cases waiting for NGO approval.
                        </div>
                    ) : (
                        <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            {pendingCases.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                                >
                                    {renderCaseDetails(item)}

                                    <div className="mt-5">
                                        <label className="mb-2 block text-sm text-gray-300">
                                            NGO note
                                        </label>
                                        <textarea
                                            value={ngoNotes[item.id] || ""}
                                            onChange={(event) =>
                                                setNgoNotes((prev) => ({
                                                    ...prev,
                                                    [item.id]: event.target.value,
                                                }))
                                            }
                                            rows="2"
                                            placeholder="Optional note for this case..."
                                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-400"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            onClick={() => updateCaseStatus(item.id, "APPROVED")}
                                            disabled={updatingId === item.id}
                                            className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                                        >
                                            Accept Case
                                        </button>
                                        <button
                                            onClick={() => updateCaseStatus(item.id, "REJECTED")}
                                            disabled={updatingId === item.id}
                                            className="rounded-xl border border-red-500/30 bg-red-500/15 px-5 py-3 font-bold text-red-200 hover:bg-red-500/25 disabled:opacity-60"
                                        >
                                            Reject Case
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                    <h2 className="text-2xl font-bold">My Accepted Cases</h2>

                    {loading ? (
                        <p className="mt-5 text-gray-300">Loading accepted cases...</p>
                    ) : acceptedCases.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-gray-300">
                            No accepted cases yet.
                        </div>
                    ) : (
                        <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            {acceptedCases.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-5"
                                >
                                    {renderCaseDetails(item)}

                                    {item.ngo_note && (
                                        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                                            <span className="font-semibold text-white">
                                                NGO note:
                                            </span>{" "}
                                            {item.ngo_note}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                    <h2 className="text-2xl font-bold">Donations Assigned to My NGO</h2>

                    {loading ? (
                        <p className="mt-5 text-gray-300">Loading assigned donations...</p>
                    ) : assignedDonations.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-gray-300">
                            No donations assigned to your NGO yet.
                        </div>
                    ) : (
                        <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            {assignedDonations.map((donation) => {
                                const donationStatus = getDonationStatus(donation);

                                return (
                                    <article
                                        key={donation.id}
                                        className="rounded-2xl border border-blue-500/20 bg-slate-950/70 p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
                                                    {donation.donation_type || "Donation"}
                                                </span>
                                                <h3 className="mt-3 text-xl font-bold text-white">
                                                    {donation.aid_request_title ||
                                                        donation.title ||
                                                        "Assigned donation"}
                                                </h3>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                                    donationStatus
                                                )}`}
                                            >
                                                {formatStatus(donationStatus)}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-2 text-sm text-gray-400 md:grid-cols-2">
                                            <p>
                                                Amount:{" "}
                                                <span className="text-gray-200">
                                                    {donation.amount
                                                        ? `${donation.amount} JOD`
                                                        : "Not specified"}
                                                </span>
                                            </p>
                                            <p>
                                                Date:{" "}
                                                <span className="text-gray-200">
                                                    {formatDate(donation.created_at)}
                                                </span>
                                            </p>
                                            <p>
                                                Donor:{" "}
                                                <span className="text-gray-200">
                                                    {getDonorName(donation)}
                                                </span>
                                            </p>
                                            <p>
                                                Type:{" "}
                                                <span className="text-gray-200">
                                                    {donation.donation_type || "Not specified"}
                                                </span>
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
