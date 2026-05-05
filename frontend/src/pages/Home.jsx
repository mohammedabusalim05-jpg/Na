import { useEffect, useState } from "react";
import { getDonationsApi } from "../api/index";
import { Link } from "react-router-dom";

export default function Home() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDonationsApi()
            .then((res) => setDonations(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white px-4 py-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Nakhwa – Donations</h1>
                <div className="flex gap-3">
                    <Link
                        to="/create-donation"
                        className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700"
                    >
                        + New Donation
                    </Link>
                    <Link
                        to="/profile"
                        className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
                    >
                        Profile
                    </Link>
                </div>
            </header>

            {loading ? (
                <p>Loading donations...</p>
            ) : donations.length === 0 ? (
                <p>No donations yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donations.map((d) => (
                        <div
                            key={d.id}
                            className="bg-white/10 rounded-2xl p-4 border border-white/10"
                        >
                            <h2 className="font-bold text-xl mb-1">{d.title}</h2>
                            <p className="text-sm text-gray-300 mb-2">
                                Type: <span className="font-mono">{d.donation_type}</span>
                            </p>
                            <p className="text-sm text-gray-200 line-clamp-3">
                                {d.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
