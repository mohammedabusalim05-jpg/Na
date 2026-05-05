import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createDonationApi, getAidRequestByIdApi } from "../api";

export default function SupportCase() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [caseDetails, setCaseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successDonation, setSuccessDonation] = useState(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const loadCase = async () => {
            try {
                setLoading(true);
                const response = await getAidRequestByIdApi(id);
                setCaseDetails(response.data);
            } catch (error) {
                console.error("Failed to load case details:", error);

                if (error.response?.status === 401) {
                    toast.error("Please login first.");
                } else if (error.response?.status === 403 || error.response?.status === 404) {
                    toast.error("This case is not available for public support.");
                } else {
                    toast.error("Failed to load case details.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadCase();
    }, [id]);

    const getNgoName = (item) =>
        item?.approved_by_ngo_name ||
        item?.approved_by_ngo_email ||
        "Nakhwa partner NGO";

    const toNumber = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    };

    const hasAmount = (value) => value !== null && value !== undefined && value !== "";

    const formatAmount = (value) =>
        hasAmount(value) ? `${toNumber(value).toFixed(2)} JOD` : "Not specified";

    const getFundingPercentage = (item) =>
        Math.min(Math.max(toNumber(item?.funding_percentage), 0), 100);

    const getRemainingAmount = () =>
        hasAmount(caseDetails?.remaining_amount) ? toNumber(caseDetails.remaining_amount) : null;

    const isFullyFundedAfterDonation = (donationAmount) => {
        const remaining = getRemainingAmount();
        return remaining !== null && donationAmount >= remaining;
    };

    const getErrorMessage = (error) => {
        const data = error.response?.data;

        if (!data) {
            return "Failed to support this case.";
        }

        if (typeof data === "string") {
            return data;
        }

        if (data.detail) {
            return data.detail;
        }

        const firstKey = Object.keys(data)[0];
        const firstValue = firstKey ? data[firstKey] : null;

        if (Array.isArray(firstValue)) {
            return `${firstKey}: ${firstValue.join(" ")}`;
        }

        if (typeof firstValue === "string") {
            return `${firstKey}: ${firstValue}`;
        }

        return "Failed to support this case.";
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Please login first to support this case.");
            navigate("/login", { state: { redirectTo: `/support-case/${id}` } });
            return;
        }

        const donationAmount = Number(amount);
        if (!amount || Number.isNaN(donationAmount) || donationAmount <= 0) {
            toast.error("Please enter an amount greater than 0.");
            return;
        }

        const remainingAmount = getRemainingAmount();
        if (remainingAmount !== null && remainingAmount <= 0) {
            toast.error("This aid request is already fully funded.");
            return;
        }

        if (remainingAmount !== null && donationAmount > remainingAmount) {
            toast.error(`Only ${remainingAmount.toFixed(2)} JOD is remaining for this aid request.`);
            return;
        }

        try {
            setSubmitting(true);
            await createDonationApi({
                title: `Support case: ${caseDetails.title}`,
                description: `Donation toward approved aid case: ${caseDetails.title}`,
                donation_type: "money",
                amount,
                aid_request_id: caseDetails.id,
            });

            setSuccessDonation({
                caseTitle: caseDetails.title,
                amount,
                ngoName: getNgoName(caseDetails),
                fullyFunded: isFullyFundedAfterDonation(donationAmount),
            });
            toast.success("You supported this case successfully.");
        } catch (error) {
            console.error("Failed to support case:", error);

            if (error.response?.status === 401) {
                toast.error("Please login first to support this case.");
                navigate("/login", { state: { redirectTo: `/support-case/${id}` } });
                return;
            }

            toast.error(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-5xl">
                <Link to="/approved-aid" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                    Back to approved cases
                </Link>

                {loading ? (
                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-8 text-gray-300 shadow-xl backdrop-blur">
                        Loading case details...
                    </div>
                ) : !caseDetails ? (
                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-10 text-center text-gray-300 shadow-xl backdrop-blur">
                        <p className="text-xl font-bold">Case unavailable</p>
                        <p className="mt-2 text-sm text-gray-400">
                            This case may not be approved for public support yet.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
                        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <div className="mb-5 flex flex-wrap gap-2">
                                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                                    {caseDetails.category}
                                </span>
                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-bold ${getUrgencyStyle(
                                        caseDetails.urgency_level
                                    )}`}
                                >
                                    {caseDetails.urgency_level}
                                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold md:text-4xl">
                                {caseDetails.title}
                            </h1>

                            <p className="mt-4 text-sm leading-7 text-gray-300">
                                {caseDetails.description}
                            </p>

                            <div className="mt-6 grid gap-3 text-sm text-gray-400 md:grid-cols-2">
                                <p>
                                    Location:{" "}
                                    <span className="text-gray-200">
                                        {caseDetails.location || "Not specified"}
                                    </span>
                                </p>
                                <p>
                                    Needed Amount:{" "}
                                    <span className="text-gray-200">
                                        {caseDetails.needed_amount
                                            ? `${caseDetails.needed_amount} JOD`
                                            : "Not specified"}
                                    </span>
                                </p>
                                <p>
                                    Beneficiary:{" "}
                                    <span className="text-gray-200">
                                        {caseDetails.beneficiary_name ||
                                            caseDetails.beneficiary_email ||
                                            "Verified beneficiary"}
                                    </span>
                                </p>
                                {caseDetails.beneficiary_name && caseDetails.beneficiary_email && (
                                    <p>
                                        Beneficiary Email:{" "}
                                        <span className="text-gray-200">
                                            {caseDetails.beneficiary_email}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                                <span className="font-semibold text-white">Managed by:</span>{" "}
                                {getNgoName(caseDetails)}
                            </div>

                            {caseDetails.admin_note && (
                                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-gray-300">
                                    <span className="font-semibold text-white">Admin note:</span>{" "}
                                    {caseDetails.admin_note}
                                </div>
                            )}

                            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-bold text-white">
                                        Funding Progress
                                    </h2>
                                    {(caseDetails.is_fully_funded ||
                                        (hasAmount(caseDetails.remaining_amount) &&
                                            toNumber(caseDetails.remaining_amount) <= 0)) && (
                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                                            Fully Funded
                                        </span>
                                    )}
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-emerald-500"
                                        style={{
                                            width: `${getFundingPercentage(caseDetails)}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-4 grid gap-2 text-sm text-gray-400 md:grid-cols-2">
                                    <p>
                                        Needed:{" "}
                                        <span className="text-gray-200">
                                            {formatAmount(caseDetails.needed_amount)}
                                        </span>
                                    </p>
                                    <p>
                                        Raised:{" "}
                                        <span className="text-gray-200">
                                            {formatAmount(caseDetails.raised_amount)}
                                        </span>
                                    </p>
                                    <p>
                                        Remaining:{" "}
                                        <span className="text-gray-200">
                                            {formatAmount(caseDetails.remaining_amount)}
                                        </span>
                                    </p>
                                    <p>
                                        Funding:{" "}
                                        <span className="text-gray-200">
                                            {getFundingPercentage(caseDetails).toFixed(2)}%
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <aside className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            {successDonation ? (
                                <div>
                                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-5">
                                        <p className="text-sm font-semibold text-emerald-200">
                                            You supported this case successfully.
                                        </p>
                                        <h2 className="mt-3 text-2xl font-bold">
                                            {successDonation.caseTitle}
                                        </h2>
                                        <div className="mt-4 space-y-2 text-sm text-gray-300">
                                            <p>
                                                Donated Amount:{" "}
                                                <span className="font-semibold text-white">
                                                    {successDonation.amount} JOD
                                                </span>
                                            </p>
                                            <p>
                                                Managed by:{" "}
                                                <span className="font-semibold text-white">
                                                    {successDonation.ngoName}
                                                </span>
                                            </p>
                                            {successDonation.fullyFunded && (
                                                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-emerald-100">
                                                    This aid request has now been fully funded.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        to="/history"
                                        className="mt-5 block rounded-xl bg-emerald-500 px-5 py-3 text-center font-bold text-white shadow-lg hover:bg-emerald-600"
                                    >
                                        View My Impact History
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-2xl font-bold">Support This Case</h2>
                                    <p className="mt-3 text-sm leading-6 text-gray-300">
                                        This donation will be linked to this case and managed by the
                                        assigned NGO.
                                    </p>

                                    <label className="mt-6 block text-sm font-semibold text-gray-200">
                                        Donation Amount
                                    </label>
                                    <div className="mt-2 flex rounded-xl border border-white/10 bg-slate-950/70 focus-within:border-emerald-400">
                                        <input
                                            type="number"
                                            min="1"
                                            max={
                                                getRemainingAmount() !== null
                                                    ? getRemainingAmount()
                                                    : undefined
                                            }
                                            step="0.01"
                                            value={amount}
                                            onChange={(event) => setAmount(event.target.value)}
                                            placeholder="Enter amount"
                                            className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none"
                                        />
                                        <span className="rounded-r-xl border-l border-white/10 px-4 py-3 text-gray-300">
                                            JOD
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="mt-5 w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white shadow-lg hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? "Recording support..." : "Support This Case"}
                                    </button>
                                </form>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
