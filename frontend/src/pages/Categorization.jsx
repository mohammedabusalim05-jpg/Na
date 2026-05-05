import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../constants/categories";

export default function Categorization() {
    const [greeting, setGreeting] = React.useState("Choose a Donation Category");

    React.useEffect(() => {
        const userName = localStorage.getItem("user_name");

        if (userName && userName !== "undefined") {
            setGreeting(`Hello, ${userName} 👋`);
        } else {
            setGreeting("Hello, Guest 👋");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black p-6 relative">
            <header className="mb-8 mt-12 text-center space-y-4">
                <div className="animate-fade-in-down">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                        {greeting}
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-200 font-serif italic opacity-90">
                        "Giving is not just about making a donation. It is about making a difference."
                    </p>
                </div>

                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                    Select a category below to start your donation journey. Make a difference today.
                </p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link
                        to={cat.path}
                        key={cat.name}
                        className={`
                            relative group overflow-hidden rounded-3xl p-6 border border-white/10
                            bg-gradient-to-br ${cat.color} 
                            transition-all duration-300 ease-out shadow-xl
                            hover:scale-[1.03] 
                            hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
                            hover:border-white/50
                            hover:brightness-110
                        `}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300"></div>

                        <div className="relative z-10 flex flex-col items-center justify-center h-40 text-center">
                            <span className="text-5xl mb-4 transform group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition duration-300">
                                {cat.icon}
                            </span>
                            <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md">
                                {cat.name}
                            </h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
