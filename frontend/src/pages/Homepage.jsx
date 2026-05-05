import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { guestApi } from "../api/index";
import nakhwaLogo from "../assets/nakhwa-logo.png";

export default function Homepage() {
    const navigate = useNavigate();

    const handleGuest = async () => {
        try {
            const res = await guestApi();

            toast.success("Continuing as guest", { duration: 2000 });

            if (res.data.access) {
                localStorage.setItem("access_token", res.data.access);
                localStorage.setItem("access", res.data.access);
            }

            if (res.data.role) {
                localStorage.setItem("role", res.data.role);
            }

            navigate("/categorization");
        } catch (err) {
            console.error(err);
            toast.error("Failed to start guest session", { duration: 2000 });
        }
    };

    const goToDonate = () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            toast.error("Please login first, or continue as guest.");
            navigate("/login", { state: { redirectTo: "/categorization" } });
            return;
        }

        navigate("/categorization");
    };

    const goToRequestAid = () => {
        const token = localStorage.getItem("access_token");
        const role = (localStorage.getItem("role") || "").toUpperCase();

        if (!token) {
            toast.error("Please login first to request aid.");
            navigate("/login", { state: { redirectTo: "/request-aid" } });
            return;
        }

        if (role !== "BENEFICIARY") {
            toast.error("Only beneficiaries can request aid.");
            return;
        }

        navigate("/request-aid");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            {/* NAVBAR */}
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src={nakhwaLogo}
                        alt="Nakhwa Logo"
                        className="h-12 w-12 rounded-2xl object-contain shadow-lg"
                    />

                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">
                            Nakhwa
                        </h1>
                        <p className="text-xs text-emerald-200">
                            Digital Humanitarian Ecosystem
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-xl border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
                <div>
                    <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                        Verified aid. Smarter donations. Greater impact.
                    </div>

                    <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
                        Connecting donors, beneficiaries, volunteers, and NGOs in one trusted platform.
                    </h2>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                        Nakhwa helps organize humanitarian support through verified aid requests,
                        donation management, volunteer participation, and admin review tools.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={goToDonate}
                            className="rounded-xl bg-emerald-500 px-7 py-3 font-bold text-white shadow-lg hover:bg-emerald-600"
                        >
                            Donate Now
                        </button>

                        <button
                            onClick={goToRequestAid}
                            className="rounded-xl bg-white px-7 py-3 font-bold text-slate-900 shadow-lg hover:bg-gray-100"
                        >
                            Request Aid
                        </button>
                    </div>

                    <button
                        onClick={handleGuest}
                        className="mt-5 text-sm text-gray-400 underline hover:text-white"
                    >
                        Continue as guest to explore donation options
                    </button>
                </div>

                {/* RIGHT CARD */}
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
                    <div className="rounded-2xl bg-slate-950/70 p-6">
                        <h3 className="text-2xl font-bold">
                            How Nakhwa works
                        </h3>

                        <div className="mt-6 space-y-5">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 font-bold">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        Beneficiary submits a request
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Aid requests are submitted with category, urgency, location, and details.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 font-bold">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        Admin reviews and verifies
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Admins approve, reject, or manage requests from the dashboard.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500 font-bold">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        Donors and NGOs provide support
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Approved cases can be viewed and supported through the platform.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROLE CARDS */}
            <section className="mx-auto max-w-7xl px-6 pb-20">
                <div className="mb-10 text-center">
                    <h3 className="text-3xl font-bold">
                        Built for every humanitarian role
                    </h3>
                    <p className="mt-3 text-gray-400">
                        Nakhwa supports the main users involved in humanitarian aid.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                        <h4 className="text-xl font-bold text-emerald-300">
                            Donors
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-gray-300">
                            Browse donation options and support verified humanitarian needs.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                        <h4 className="text-xl font-bold text-blue-300">
                            Beneficiaries
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-gray-300">
                            Submit aid requests and track approval status after admin review.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                        <h4 className="text-xl font-bold text-purple-300">
                            Volunteers
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-gray-300">
                            Participate in campaigns, support field work, and contribute time.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                        <h4 className="text-xl font-bold text-yellow-300">
                            NGOs
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-gray-300">
                            Manage campaigns, coordinate aid, and work with verified cases.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}