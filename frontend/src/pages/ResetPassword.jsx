import { useState } from "react";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirm) {
            alert("Passwords do not match.");
            return;
        }

        alert("Password reset successfully! You can now log in.");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black 
                    flex items-center justify-center px-6 text-white">

            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 
                      p-10 rounded-3xl shadow-xl">

                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition 
                     bg-white/10 border border-white/20 backdrop-blur-lg 
                     px-4 py-2 rounded-xl shadow hover:bg-white/20"
                >
                    ← Back
                </button>

                <h1 className="text-3xl font-extrabold text-center mb-4">Create New Password</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* password */}
                    <div>
                        <label className="block text-lg mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={show ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/20 border border-white/30 
                           backdrop-blur-lg focus:outline-none"
                                placeholder="Enter new password"
                            />

                            <span
                                onClick={() => setShow(!show)}
                                className="absolute right-4 top-3 cursor-pointer text-white/70 hover:text-white"
                            >
                                {show ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                    {/* confirm */}
                    <div>
                        <label className="block text-lg mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={show2 ? "text" : "password"}
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/20 border border-white/30 
                           backdrop-blur-lg focus:outline-none"
                                placeholder="Re-enter password"
                            />

                            <span
                                onClick={() => setShow2(!show2)}
                                className="absolute right-4 top-3 cursor-pointer text-white/70 hover:text-white"
                            >
                                {show2 ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-lg font-bold"
                    >
                        Reset Password
                    </button>

                </form>
            </div>
        </div>
    );
}
