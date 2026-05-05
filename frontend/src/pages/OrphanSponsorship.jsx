import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";
export default function OrphanSponsorship() {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    const [otherType, setOtherType] = useState("");
    const [duration, setDuration] = useState(null);
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const sponsorshipTypes = [
        "Monthly Financial Sponsorship",
        "Yearly Financial Sponsorship",
        "Education Sponsorship (Tuition / Books)",
        "Health Sponsorship (Medical Needs)",
        "Food & Essentials Sponsorship",
        "Full Sponsorship Package",
    ];

    const durations = [
        "3 Months",
        "6 Months",
        "12 Months",
        "More than 1 Year",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedType && !otherType.trim()) return;
        if (!duration) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const sponsorship = selectedType || otherType;

        const formData = new FormData();
        formData.append("title", "Orphan Sponsorship");
        formData.append("donation_type", "orphans");
        formData.append(
            "description",
            `Name: ${fullName}
                Phone: ${phone}
                City: ${city}
                Type: ${sponsorship}
                Duration: ${duration}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Sponsorship Confirmed!</h2>
                    <p className="text-gray-300 mb-8">Thank you for sponsoring an orphan.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Orphan Sponsorship</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Category:</span>
                            <span className="text-emerald-400 font-bold ml-1">
                                {selectedType || otherType}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Duration:</span> {duration}</p>
                        <p><span className="text-gray-400">Phone:</span> {phone}</p>
                        <p><span className="text-gray-400">Location:</span> {city}</p>
                    </div>

                    <button
                        onClick={() => navigate("/categorization")}
                        className="w-full bg-green-600 hover:bg-green-700 transition rounded-xl py-3 text-lg font-bold shadow-lg shadow-green-900/20"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-black py-16 px-6 text-white">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Orphan Sponsorship 🤝
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Support an orphan by providing financial, educational, or essential needs sponsorship.
                </p>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div>
                        <label className="block text-lg mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-lg mb-2">Phone Number</label>
                        <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="07XXXXXXXX"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-lg mb-2">City / Country</label>
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Your city and country"
                        />
                    </div>

                    {/* Sponsorship Type */}
                    <div>
                        <label className="block text-lg mb-3">Sponsorship Type</label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {sponsorshipTypes.map((type, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedType(type);
                                        setOtherType("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${selectedType === type
                                            ? "bg-emerald-700/60 border-emerald-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Sponsorship Type */}
                    <div>
                        <label className="block text-lg mb-2">Other Sponsorship Type (optional)</label>
                        <input
                            type="text"
                            value={otherType}
                            onChange={(e) => {
                                setOtherType(e.target.value);
                                setSelectedType(null);
                            }}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Describe another type of sponsorship"
                        />
                    </div>

                    {/* Sponsorship Amount */}
                    <div>
                        <label className="block text-lg mb-2">Estimated Monthly Amount (optional)</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="e.g. 50 JOD"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-lg mb-3">Sponsorship Duration</label>

                        <div className="grid grid-cols-2 gap-4">
                            {durations.map((d, i) => (
                                <div
                                    key={i}
                                    onClick={() => setDuration(d)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${duration === d
                                            ? "bg-emerald-700/60 border-emerald-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-lg mb-2">Additional Notes (optional)</label>
                        <textarea
                            className="w-full p-3 h-28 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Add any preferences or additional information."
                        ></textarea>
                    </div>

                    <NGOSelector
                        donationType="orphans"
                        selectedNgoId={selectedNgoId}
                        onChange={setSelectedNgoId}
                    />

                    {/* Agreement */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className="w-5 h-5 mt-1"
                        />
                        <p className="text-sm text-gray-300">
                            By confirming this box, you formally acknowledge your intention to sponsor an orphan
                            and agree to cooperate with the organization to complete all required procedures.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 transition rounded-xl py-3 text-lg font-bold">
                        Submit Orphan Sponsorship
                    </button>
                </form>
            </div>
        </div>
    );
}
