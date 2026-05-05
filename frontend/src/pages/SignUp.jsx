import { useState } from "react";

export default function SignUp() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [gender, setGender] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const password = e.target.password.value;
        const confirm = e.target.confirm.value;

        if (password !== confirm) {
            alert("Passwords do not match.");
            return;
        }

        if (!gender) {
            alert("Please select your gender.");
            return;
        }

        alert("Account created successfully! 🎉");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black 
                    flex items-center justify-center px-6 text-white">

            <div className="relative max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-6 left-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>


                <h1 className="text-3xl font-extrabold text-center mb-6">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Full Name */}
                    <div>
                        <label className="block text-lg mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            required
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-lg mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="example@mail.com"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-lg mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            required
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="07XXXXXXXX"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-lg mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            required
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Your city"
                        />
                    </div>

                    {/* GENDER */}
                    <div>
                        <label className="block text-lg mb-3">Gender</label>

                        <div className="grid grid-cols-2 gap-4">
                            {["Male", "Female"].map((g) => (
                                <div
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${gender === g
                                            ? "bg-blue-700/60 border-blue-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {g}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-lg mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                required
                                className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                                placeholder="Enter password"
                            />
                            <span
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-3 cursor-pointer text-white/70 hover:text-white"
                            >
                                {showPass ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-lg mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm"
                                required
                                className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                                placeholder="Confirm password"
                            />
                            <span
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-3 cursor-pointer text-white/70 hover:text-white"
                            >
                                {showConfirm ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                    {/* Agreement */}
                    <div className="flex items-start gap-3">
                        <input type="checkbox" required className="w-5 h-5 mt-1" />
                        <p className="text-sm text-gray-300">
                            By creating an account, you agree to follow all platform rules and verify that
                            all provided information is correct.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-lg font-bold"
                    >
                        Create Account
                    </button>

                </form>

                {/* Already have account link */}
                <p className="text-center mt-6 text-gray-300">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-400 hover:underline">
                        Login
                    </a>
                </p>

            </div>
        </div>
    );
}
