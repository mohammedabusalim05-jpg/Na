import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SideMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");
    const role = (localStorage.getItem("role") || "").toUpperCase();
    const userName = localStorage.getItem("user_name") || "User";

    if (!token) {
        return null;
    }

    if (role === "ADMIN") {
        return null;
    }

    const logout = () => {
        localStorage.clear();
        setOpen(false);
        navigate("/");
    };

    const menuItemsByRole = {
        VOLUNTEER: [
            { label: "Volunteer Dashboard", path: "/volunteer-dashboard" },
            { label: "Approved Aid Cases", path: "/approved-aid" },
            { label: "Donations Page", path: "/categorization" },
            { label: "My Impact History", path: "/history" },
            { label: "Profile", path: "/profile" },
            { label: "Billing Info", disabled: true },
        ],

        BENEFICIARY: [
            { label: "Request Aid", path: "/request-aid" },
            { label: "Approved Aid Cases", path: "/approved-aid" },
            { label: "Profile", path: "/profile" },
        ],

        DONOR: [
            { label: "Approved Aid Cases", path: "/approved-aid" },
            { label: "Donations Page", path: "/categorization" },
            { label: "My Impact History", path: "/history" },
            { label: "Profile", path: "/profile" },
            { label: "Billing Info", disabled: true },
        ],

        NGO_EMPLOYEE: [
            { label: "NGO Dashboard", path: "/ngo-dashboard" },
            { label: "Approved Aid Cases", path: "/approved-aid" },
            { label: "Donations Page", path: "/categorization" },
            { label: "My Impact History", path: "/history" },
            { label: "Profile", path: "/profile" },
        ],
    };

    const menuItems = menuItemsByRole[role] || [
        { label: "Home", path: "/" },
        { label: "Approved Aid Cases", path: "/approved-aid" },
        { label: "Donations Page", path: "/categorization" },
        { label: "My Impact History", path: "/history" },
        { label: "Profile", path: "/profile" },
    ];

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed left-5 top-5 z-[9999] flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-slate-900 text-2xl text-white shadow-xl hover:bg-slate-800"
                aria-label="Open menu"
            >
                ☰
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-[9999] h-full w-80 max-w-[85vw] bg-slate-950 text-white shadow-2xl transition-transform duration-300 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                    <div>
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <h2 className="text-lg font-bold">{userName}</h2>
                        <p className="text-xs text-emerald-300">{role || "USER"}</p>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-5">
                    <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-4 py-3 font-semibold text-gray-200 hover:bg-white/10"
                    >
                        Home
                    </Link>

                    {menuItems.map((item) =>
                        item.disabled ? (
                            <div
                                key={item.label}
                                className="cursor-not-allowed rounded-xl px-4 py-3 font-semibold text-gray-500"
                            >
                                {item.label}
                                <span className="ml-2 text-xs">Coming soon</span>
                            </div>
                        ) : (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-4 py-3 font-semibold text-gray-200 hover:bg-white/10"
                            >
                                {item.label}
                            </Link>
                        )
                    )}

                    <button
                        onClick={logout}
                        className="mt-4 rounded-xl bg-red-500/20 px-4 py-3 text-left font-semibold text-red-200 hover:bg-red-500/30"
                    >
                        Logout
                    </button>
                </nav>
            </aside>
        </>
    );
}
