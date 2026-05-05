import React from "react";

const categories = [
    { name: "Blood Donation", icon: "🩸", path: "/blood", color: "from-red-300/40 to-red-100/20" },
    { name: "Organ Donation", icon: "🫀", path: "/organ", color: "from-rose-300/40 to-rose-100/20" },
    { name: "Financial Donation", icon: "💵", path: "/money", color: "from-green-300/40 to-green-100/20" },
    { name: "Food Donation", icon: "🍱", path: "/food", color: "from-orange-300/40 to-yellow-100/20" },
    { name: "Adahi (Sacrifice)", icon: "🐑", path: "/adahi", color: "from-yellow-300/40 to-yellow-100/20" },
    { name: "Clothes Donation", icon: "👕", path: "/clothes", color: "from-indigo-300/40 to-indigo-100/20" },
    { name: "Furniture Donation", icon: "🛋️", path: "/furniture", color: "from-amber-300/40 to-amber-100/20" },
    { name: "Medical Equipment", icon: "🏥", path: "/medical", color: "from-teal-300/40 to-teal-100/20" },
    { name: "Household Items", icon: "🏠", path: "/household", color: "from-slate-300/40 to-slate-100/20" },
    { name: "Clean Water", icon: "🚰", path: "/water", color: "from-cyan-300/40 to-cyan-100/20" },

    { name: "Baby Supplies", icon: "🍼", path: "/baby", color: "from-pink-300/40 to-pink-100/20" },
    { name: "Toys Donation", icon: "🧸", path: "/toys", color: "from-orange-300/40 to-orange-100/20" },
    { name: "Education Support", icon: "🎒", path: "/education", color: "from-blue-300/40 to-blue-100/20" },
    { name: "Electronics", icon: "📱", path: "/electronics", color: "from-indigo-300/40 to-indigo-100/20" },
    { name: "Cleaning Supplies", icon: "🧼", path: "/cleaning", color: "from-lime-300/40 to-lime-100/20" },
    { name: "Medicine Support", icon: "💊", path: "/medicine-support", color: "from-purple-300/40 to-purple-100/20" },
    { name: "Pet Support & Adoption", icon: "🐾", path: "/pets", color: "from-stone-300/40 to-stone-100/20" },
    { name: "Volunteer Time", icon: "⏳", path: "/volunteer", color: "from-gray-300/40 to-gray-100/20" },
    { name: "Professional Help", icon: "🛠️", path: "/skills", color: "from-yellow-400/40 to-yellow-100/20" },
    { name: "Family Support", icon: "👨‍👩‍👧‍👦", path: "/families", color: "from-rose-400/40 to-rose-100/20" },
    { name: "Refugee Support", icon: "🛂", path: "/refugees", color: "from-sky-300/40 to-sky-100/20" },
    { name: "Orphan Sponsorship", icon: "🤝", path: "/orphans", color: "from-green-400/40 to-green-100/20" },
    { name: "General Charity", icon: "🤲", path: "/charity-general", color: "from-violet-300/40 to-violet-100/20" },
    { name: "Food Coupons", icon: "🎟️", path: "/food-coupons", color: "from-fuchsia-300/40 to-fuchsia-100/20" },
];

export default function Categories() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Donation Categories</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat, idx) => (
                    <a
                        key={idx}
                        href={cat.path}
                        className={`p-5 rounded-xl shadow-sm bg-gradient-to-br ${cat.color} hover:scale-105 transition-all`}
                    >
                        <div className="text-4xl">{cat.icon}</div>
                        <div className="mt-2 text-sm font-medium text-gray-700">{cat.name}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
