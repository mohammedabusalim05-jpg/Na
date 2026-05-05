// src/dashboard/Settings.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProfileApi, updateProfileApi } from "../api/index";
import toast from "react-hot-toast";

export default function Settings() {
    const [profile, setProfile] = useState({
        first_name: "",
        email: ""
    });
    const [passwords, setPasswords] = useState({
        password: "",
        confirm_password: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfileApi();
                setProfile({
                    first_name: res.data.first_name || "",
                    email: res.data.email || ""
                });
            } catch (error) {
                console.error(error);
                // If 401, mostly handled by interceptor, but silent fail here is ok
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            await updateProfileApi({
                first_name: profile.first_name,
                // Email updates might require re-verification or backend logic, but allowing try
                email: profile.email
            });
            toast.success("Profile updated successfully");
            // Update local storage name if changed
            if (profile.first_name) {
                localStorage.setItem("user_name", profile.first_name);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };

    const handleUpdatePassword = async () => {
        if (passwords.password !== passwords.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }
        if (!passwords.password) return;

        try {
            await updateProfileApi({
                password: passwords.password
            });
            toast.success("Password updated successfully");
            setPasswords({ password: "", confirm_password: "" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update password");
        }
    };

    return (
        <div className="text-white space-y-8">

            <h1 className="text-2xl font-bold">Settings</h1>

            {/* Card */}
            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Account Settings */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Account Settings</h2>

                    <div className="space-y-2">
                        <label className="block text-sm text-gray-300">Name</label>
                        <input
                            type="text"
                            value={profile.first_name}
                            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        onClick={handleUpdateProfile}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                        Save Changes
                    </button>
                </div>

                <hr className="border-white/20" />

                {/* Security Settings */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Security</h2>

                    <div className="space-y-2">
                        <label className="block text-sm text-gray-300">New Password</label>
                        <input
                            type="password"
                            placeholder="New password"
                            value={passwords.password}
                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={passwords.confirm_password}
                            onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        onClick={handleUpdatePassword}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                        Update Password
                    </button>
                </div>
            </motion.div>

        </div>
    );
}
