import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            alert("Please enter your email.");
            return;
        }

        // Here you will send reset code backend
        alert("A verification code has been sent to your email.");
        window.location.href = "/verify-reset";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black 
                    flex items-center justify-center px-6 text-white">

            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 
                      p-10 rounded-3xl shadow-xl">

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition 
                     bg-white/10 border border-white/20 backdrop-blur-lg 
                     px-4 py-2 rounded-xl shadow hover:bg-white/20"
                >
                    ← Back
                </button>

                <h1 className="text-3xl font-extrabold text-center mb-4">
                    Reset Password
                </h1>

                <p className="text-gray-300 text-center mb-8">
                    Enter your email to receive a verification code.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* EMAIL INPUT */}
                    <div>
                        <label className="block text-lg mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 
                         backdrop-blur-lg focus:outline-none"
                            placeholder="example@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-lg font-bold"
                    >
                        Send Reset Code
                    </button>

                </form>

            </div>
        </div>
    );
}
