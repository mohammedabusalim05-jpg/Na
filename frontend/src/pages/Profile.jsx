import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Profile() {
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        role: "",
        phone: "",
        governorate: "",
        blood_type: "",
        birth_date: "",
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const roleDescriptions = {
        ADMIN: "You can manage users, donations, aid requests, campaigns, and system data.",
        DONOR: "You can browse donation categories and support verified humanitarian needs.",
        VOLUNTEER: "You can apply to volunteering campaigns and also donate when you want.",
        BENEFICIARY: "You can submit aid requests and track their approval status.",
        NGO_EMPLOYEE: "You can support NGO-related campaign and humanitarian work.",
        USER: "Your account is part of the Nakhwa humanitarian platform.",
    };

    const getCurrentProfileKey = () => {
        const email = localStorage.getItem("email") || "";
        const role = (localStorage.getItem("role") || "USER").toUpperCase();
        const name = localStorage.getItem("user_name") || "user";
        return `profile_data_${email || name}_${role}`;
    };

    useEffect(() => {
        const loadProfile = async () => {
            const localRole = (localStorage.getItem("role") || "USER").toUpperCase();
            const localEmail = localStorage.getItem("email") || "";
            const localName = localStorage.getItem("user_name") || "Nakhwa User";
            const profileKey = getCurrentProfileKey();
            const savedProfile = JSON.parse(localStorage.getItem(profileKey) || "{}");

            let backendProfile = {};

            try {
                const res = await api.get("/accounts/profile/");
                backendProfile = res.data || {};

                if (backendProfile.email) {
                    localStorage.setItem("email", backendProfile.email);
                }

                if (backendProfile.role) {
                    localStorage.setItem("role", backendProfile.role.toUpperCase());
                }
            } catch (error) {
                console.warn("Could not load backend profile, using local data.", error);
            }

            const backendName =
                backendProfile.full_name ||
                backendProfile.name ||
                backendProfile.user_name ||
                `${backendProfile.first_name || ""} ${backendProfile.last_name || ""}`.trim();

            setProfile({
                full_name:
                    savedProfile.full_name ||
                    backendName ||
                    localName,
                email:
                    backendProfile.email ||
                    localEmail ||
                    savedProfile.email ||
                    "",
                role:
                    (backendProfile.role || localRole || savedProfile.role || "USER").toUpperCase(),
                phone:
                    savedProfile.phone ||
                    backendProfile.phone ||
                    "",
                governorate:
                    savedProfile.governorate ||
                    backendProfile.governorate ||
                    "",
                blood_type:
                    savedProfile.blood_type ||
                    backendProfile.blood_type ||
                    "",
                birth_date:
                    savedProfile.birth_date ||
                    backendProfile.birth_date ||
                    "",
            });
        };

        loadProfile();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const profileKey = getCurrentProfileKey();
            localStorage.setItem(profileKey, JSON.stringify(profile));

            if (profile.full_name) {
                localStorage.setItem("user_name", profile.full_name);
            }

            if (profile.email) {
                localStorage.setItem("email", profile.email);
            }

            if (profile.role) {
                localStorage.setItem("role", profile.role.toUpperCase());
            }

            toast.success("Profile saved successfully.");
            setEditMode(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!passwordData.current_password) {
            toast.error("Current password is required.");
            return;
        }

        if (!passwordData.new_password) {
            toast.error("New password is required.");
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            setChangingPassword(true);
            await api.post("/accounts/change-password/", passwordData);

            toast.success("Password changed successfully. Please login again.");

            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });

            localStorage.clear();

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            console.error("Change password error:", error);

            const backendError =
                error.response?.data?.error ||
                error.response?.data?.detail ||
                "Failed to change password.";

            if (Array.isArray(backendError)) {
                toast.error(backendError.join(" "));
            } else {
                toast.error(backendError);
            }
        } finally {
            setChangingPassword(false);
        }
    };

    const role = (profile.role || "USER").toUpperCase();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold">My Profile</h1>
                    <p className="mt-2 text-gray-300">
                        View your account details and manage your security settings.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center shadow-xl backdrop-blur">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-4xl font-black shadow-lg">
                            {(profile.full_name || "U").charAt(0).toUpperCase()}
                        </div>

                        <h2 className="mt-5 text-2xl font-bold">
                            {profile.full_name || "Nakhwa User"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-300">
                            {profile.email || "No email saved"}
                        </p>

                        <div className="mt-5 rounded-2xl bg-slate-950/60 p-4">
                            <p className="text-sm text-gray-400">Account Type</p>
                            <p className="mt-1 font-bold text-emerald-300">{role}</p>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-gray-300">
                            {roleDescriptions[role] || roleDescriptions.USER}
                        </p>
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Account Information</h2>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Keep your basic details updated for Nakhwa.
                                    </p>
                                </div>

                                {!editMode && (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm text-gray-300">
                                            Full Name
                                        </label>
                                        <input
                                            name="full_name"
                                            value={profile.full_name}
                                            onChange={handleProfileChange}
                                            disabled={!editMode}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white disabled:opacity-70"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            disabled={!editMode}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white disabled:opacity-70"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-gray-300">
                                            Phone
                                        </label>
                                        <input
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            disabled={!editMode}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white disabled:opacity-70"
                                            placeholder="07XXXXXXXX"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-gray-300">
                                            Governorate
                                        </label>
                                        <input
                                            name="governorate"
                                            value={profile.governorate}
                                            onChange={handleProfileChange}
                                            disabled={!editMode}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white disabled:opacity-70"
                                            placeholder="Amman"
                                        />
                                    </div>
                                </div>

                                {editMode && (
                                    <div className="flex gap-3 pt-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditMode(false)}
                                            className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold">Security Settings</h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Change your account password securely.
                                </p>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-5">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-300">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="current_password"
                                        value={passwordData.current_password}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm text-gray-300">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-gray-300">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                    {changingPassword ? "Changing..." : "Change Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}