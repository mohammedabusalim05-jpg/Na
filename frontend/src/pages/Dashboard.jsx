import { Link } from "react-router-dom";
import { getDonationsApi } from "../api";
export default function Dashboard() {


    useEffect(() => {
        async function load() {
            const res = await getDonationsApi();
            setDonations(res.data);
        }
        load();
    }, []);

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">Nakhwa Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <Link
                    to="/donations"
                    className="bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/20 transition"
                >
                    <h2 className="text-xl font-bold">📦 All Donations</h2>
                    <p className="text-gray-300">View all donations from users</p>
                </Link>

                <Link
                    to="/donations/create"
                    className="bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/20 transition"
                >
                    <h2 className="text-xl font-bold">➕ Create Donation</h2>
                    <p className="text-gray-300">Add a new donation</p>
                </Link>

                <Link
                    to="/donations/filter"
                    className="bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/20 transition"
                >
                    <h2 className="text-xl font-bold">🎯 Filter by Category</h2>
                    <p className="text-gray-300">Search donations by type</p>
                </Link>

            </div>
        </div>
    );
}
