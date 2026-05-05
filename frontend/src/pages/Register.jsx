// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/index";
import toast from "react-hot-toast";

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("DONOR");

    const navigate = useNavigate();

    const redirectByRole = (userRole) => {
        const finalRole = (userRole || "").toUpperCase();

        if (finalRole === "ADMIN") {
            navigate("/admin");
        } else if (finalRole === "BENEFICIARY") {
            navigate("/request-aid");
        } else if (finalRole === "VOLUNTEER") {
            navigate("/volunteer-dashboard");
        } else {
            navigate("/categorization");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password1 !== password2) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await registerApi({
                full_name: fullName,
                email,
                password: password1,
                role,
            });

            console.log("REGISTER RESPONSE:", res.data);

            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);

            const finalRole = (
                res.data.role ||
                res.data.user?.role ||
                role
            ).toUpperCase();

            localStorage.setItem("role", finalRole);

            if (res.data.user_name) {
                localStorage.setItem("user_name", res.data.user_name);
            } else {
                localStorage.setItem("user_name", fullName);
            }

            toast.success("Account created successfully!");

            redirectByRole(finalRole);
        } catch (err) {
            console.error(err);

            if (err.response?.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Registration failed");
            }
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

                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h1>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block mb-1">Full Name</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Account Type</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                        >
                            <option value="DONOR">Donor</option>
                            <option value="VOLUNTEER">Volunteer</option>
                            <option value="BENEFICIARY">Beneficiary</option>
                            <option value="NGO_EMPLOYEE">NGO Employee</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            required
                        />
                    </div>

                    <button className="w-full bg-green-600 hover:bg-green-700 transition rounded-xl py-3 text-lg font-bold mt-2">
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-300 mt-6">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-blue-300 hover:underline text-sm ml-1"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
