import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    createDonationApi,
    getNgosByDonationCategoryApi,
} from "../api";

const CATEGORY_LABELS = {
    food: "Food Aid",
    medical: "Medical Aid",
    education: "Education Aid",
    money: "Financial Aid",
};

export default function GeneralCategoryDonation() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [ngos, setNgos] = useState([]);
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successDonation, setSuccessDonation] = useState(null);

    const categoryLabel = useMemo(() => {
        if (CATEGORY_LABELS[type]) {
            return CATEGORY_LABELS[type];
        }

        return String(type || "donation").replace(/[-_]/g, " ");
    }, [type]);

    useEffect(() => {
        const loadNgos = async () => {
            try {
                setLoading(true);
                const response = await getNgosByDonationCategoryApi(type);
                setNgos(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Failed to load category NGOs:", error);
                toast.error("Failed to load NGOs for this category.");
            } finally {
                setLoading(false);
            }
        };

        loadNgos();
    }, [type]);

    const getNgoName = (ngo) =>
        ngo?.display_name || ngo?.ngo_name || ngo?.ngo_email || "Nakhwa partner NGO";

    const getErrorMessage = (error) => {
        const data = error.response?.data;

        if (!data) return "Failed to create donation.";
        if (typeof data === "string") return data;
        if (data.detail) return data.detail;

        const firstKey = Object.keys(data)[0];
        const firstValue = firstKey ? data[firstKey] : null;

        if (Array.isArray(firstValue)) {
            return `${firstKey}: ${firstValue.join(" ")}`;
        }

        if (typeof firstValue === "string") {
            return `${firstKey}: ${firstValue}`;
        }

        return "Failed to create donation.";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Please login first to donate.");
            navigate("/login", { state: { redirectTo: `/general-donation/${type}` } });
            return;
        }

        if (!selectedNgo) {
            toast.error("Please select an NGO.");
            return;
        }

        const donationAmount = Number(amount);
        if (!amount || Number.isNaN(donationAmount) || donationAmount <= 0) {
            toast.error("Please enter an amount greater than 0.");
            return;
        }

        try {
            setSubmitting(true);
            await createDonationApi({
                title: `${type} support donation`,
                description: `General donation for ${type} aid`,
                donation_type: type,
                amount,
                assigned_ngo_id: selectedNgo.ngo_id,
            });

            setSuccessDonation({
                type: categoryLabel,
                amount,
                ngoName: getNgoName(selectedNgo),
            });
            toast.success("Your donation was assigned successfully.");
        } catch (error) {
            console.error("Failed to submit category donation:", error);

            if (error.response?.status === 401) {
                toast.error("Please login first to donate.");
                navigate("/login", { state: { redirectTo: `/general-donation/${type}` } });
                return;
            }

            toast.error(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">
                <Link
                    to="/categorization"
                    className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                >
                    Back to categories
                </Link>

                <header className="mt-8">
                    <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                        General Category Donation
                    </div>
                    <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
                        Donate to {categoryLabel}
                    </h1>
                    <p className="mt-3 max-w-3xl text-gray-300">
                        Choose a verified NGO linked to this category. Your donation will be
                        assigned to that NGO without being tied to a specific aid request.
                    </p>
                </header>

                {successDonation ? (
                    <section className="mt-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/15 p-8 shadow-xl backdrop-blur">
                        <p className="text-sm font-semibold text-emerald-200">
                            Your donation was assigned successfully.
                        </p>
                        <h2 className="mt-3 text-3xl font-bold">{successDonation.type}</h2>
                        <div className="mt-5 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
                            <p>
                                Amount:{" "}
                                <span className="font-semibold text-white">
                                    {successDonation.amount} JOD
                                </span>
                            </p>
                            <p>
                                NGO:{" "}
                                <span className="font-semibold text-white">
                                    {successDonation.ngoName}
                                </span>
                            </p>
                        </div>
                        <Link
                            to="/history"
                            className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white shadow-lg hover:bg-emerald-600"
                        >
                            View My Impact History
                        </Link>
                    </section>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
                        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <h2 className="text-2xl font-bold">Choose an NGO</h2>

                            {loading ? (
                                <p className="mt-5 text-gray-300">Loading linked NGOs...</p>
                            ) : ngos.length === 0 ? (
                                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-gray-300">
                                    No NGOs are linked to this category yet.
                                </div>
                            ) : (
                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    {ngos.map((ngo) => {
                                        const selected = selectedNgo?.id === ngo.id;

                                        return (
                                            <button
                                                key={ngo.id}
                                                type="button"
                                                onClick={() => setSelectedNgo(ngo)}
                                                className={`rounded-2xl border p-5 text-left transition ${
                                                    selected
                                                        ? "border-emerald-400 bg-emerald-500/15"
                                                        : "border-white/10 bg-slate-950/60 hover:border-emerald-400/50"
                                                }`}
                                            >
                                                <p className="text-lg font-bold text-white">
                                                    {getNgoName(ngo)}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    {ngo.ngo_email || "Email not available"}
                                                </p>

                                                {ngo.display_name && (
                                                    <p className="mt-3 text-sm text-emerald-200">
                                                        {ngo.display_name}
                                                    </p>
                                                )}

                                                {ngo.description && (
                                                    <p className="mt-3 text-sm leading-6 text-gray-300">
                                                        {ngo.description}
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        <aside className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <h2 className="text-2xl font-bold">Donation Amount</h2>

                            <label className="mt-6 block text-sm font-semibold text-gray-200">
                                Amount
                            </label>
                            <div className="mt-2 flex rounded-xl border border-white/10 bg-slate-950/70 focus-within:border-emerald-400">
                                <input
                                    type="number"
                                    min="1"
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

                            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-gray-300">
                                Selected NGO:{" "}
                                <span className="font-semibold text-white">
                                    {selectedNgo ? getNgoName(selectedNgo) : "None selected"}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || loading || ngos.length === 0}
                                className="mt-5 w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white shadow-lg hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Assigning donation..." : "Donate"}
                            </button>
                        </aside>
                    </form>
                )}
            </div>
        </div>
    );
}
