import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { guestApi } from "../api/index";

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
            navigate("/categorization");
        } catch (err) {
            console.error(err);
            toast.error("Failed to start guest session", { duration: 2000 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-5xl font-extrabold mb-6">Welcome to Nakhwa </h1>
            <p className="text-lg mb-8 max-w-2xl text-center">
                Join us in making a difference. Register to donate or continue as a guest to explore categories.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/register"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition"
                >
                    Register
                </Link>
                <button
                    onClick={handleGuest}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition"
                >
                    Continue as Guest
                </button>
            </div>

            <div className="mt-6">
                <Link
                    to="/request-aid"
                    className="text-gray-400 hover:text-white underline text-sm"
                >
                    Need help? Request Aid here
                </Link>
            </div>
        </div >
    );
}
