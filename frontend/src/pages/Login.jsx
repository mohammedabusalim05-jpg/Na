// src/pages/Login.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { loginApi } from "../api/index";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const clearOldProfileData = () => {
        Object.keys(localStorage).forEach((key) => {
            if (key === "profile_data" || key.startsWith("profile_data_")) {
                localStorage.removeItem(key);
            }
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginApi(email, password);
            console.log("LOGIN RESPONSE:", res.data);

            clearOldProfileData();

            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            localStorage.setItem("email", email);

            if (res.data.role) {
                localStorage.setItem("role", res.data.role.toUpperCase());
            } else {
                localStorage.setItem("role", "USER");
            }

            if (res.data.user_name) {
                localStorage.setItem("user_name", res.data.user_name);
            } else {
                localStorage.setItem("user_name", email);
            }

            toast.success("Login successful!");

            const role = (res.data.role || "").toUpperCase();
            const redirectTo = location.state?.redirectTo;

            if (role === "ADMIN") {
                window.location.href = "/admin";
                return;
            }

            if (redirectTo === "/request-aid" && role !== "BENEFICIARY") {
                toast.error("Only beneficiaries can request aid.");
                navigate("/categorization");
                return;
            }

            if (redirectTo) {
                navigate(redirectTo);
                return;
            }

            if (role === "BENEFICIARY") {
                navigate("/request-aid");
            } else if (role === "VOLUNTEER") {
                navigate("/volunteer-dashboard");
            } else if (role === "NGO_EMPLOYEE") {
                navigate("/ngo-dashboard");
            } else {
                navigate("/categorization");
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || "Login failed";
            setError(msg);
            toast.error(`Error: ${msg}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center text-white px-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl max-w-md w-full">
                <button
                    onClick={() => navigate("/")}
                    className="text-white/70 hover:text-white mb-6 transition"
                >
                    ← Back Home
                </button>

                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-lg mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-200">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-12 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg text-white"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white text-xl"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center gap-2 text-gray-300 text-sm">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded bg-white/10 border border-white/30"
                            />
                            Remember Me
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-300 hover:text-blue-400"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-lg font-bold">
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-300 mt-6">
                    Don&apos;t have an account?
                    <Link
                        to="/register"
                        className="text-blue-300 hover:underline text-sm ml-1"
                    >
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
