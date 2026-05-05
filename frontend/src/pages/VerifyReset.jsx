import { useState } from "react";

export default function VerifyReset() {
    const [code, setCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (code.length < 4) {
            alert("Please enter a valid verification code.");
            return;
        }

        alert("Code verified successfully!");
        window.location.href = "/reset-password";
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

                <h1 className="text-3xl font-extrabold text-center mb-4">Verify Code</h1>

                <p className="text-gray-300 text-center mb-8">
                    Enter the 4-digit verification code sent to your email.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <input
                            type="text"
                            required
                            maxLength={4}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full text-center text-2xl tracking-widest p-3 rounded-xl bg-white/20 border border-white/30 
                         backdrop-blur-lg focus:outline-none"
                            placeholder="____"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-lg font-bold"
                    >
                        Verify Code
                    </button>

                </form>

            </div>
        </div>
    );
}
