import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function GeneralCharity() {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    const [otherType, setOtherType] = useState("");
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const charityTypes = [
        "Helping Families in Need",
        "Supporting Emergency Cases",
        "Elderly Assistance",
        "Widows Support",
        "Debt Relief Support",
        "Food Boxes for Poor Families",
        "Monthly Family Support",
        "Winter Clothing & Heating Aid",
        "Medical Cases (Medication)",
        "Shelter Assistance",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedType && !otherType.trim()) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const cause = selectedType || otherType;

        const formData = new FormData();
        formData.append("title", "General Charity");
        formData.append("donation_type", "charity_general");
        formData.append(
            "description",
            `Name: ${fullName}
            Phone: ${phone}
            City: ${city}
            Cause: ${cause}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for your generous charity.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> General Charity</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Cause:</span>
                            <span className="text-violet-400 font-bold ml-1">
                                {selectedType || otherType}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Phone:</span> {phone}</p>
                        <p><span className="text-gray-400">City:</span> {city}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-violet-900 via-slate-900 to-black py-16 px-6 text-white">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl 
            border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* Back */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    General Charity 🤲
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Support humanitarian cases by offering general, unrestricted charity.
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
                        <label className="block text-lg mb-2">City</label>
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Your city"
                        />
                    </div>

                    {/* Charity Type */}
                    <div>
                        <label className="block text-lg mb-3">Type of Charity</label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {charityTypes.map((type, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedType(type);
                                        setOtherType("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                                    ${selectedType === type
                                            ? "bg-violet-700/60 border-violet-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other */}
                    <div>
                        <label className="block text-lg mb-2">Other Charity Type (optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Type your donation purpose"
                            value={otherType}
                            onChange={(e) => {
                                setOtherType(e.target.value);
                                setSelectedType(null);
                            }}
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-lg mb-2">Donation Amount (optional)</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="e.g. 20 JOD"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-lg mb-2">Additional Notes (optional)</label>
                        <textarea
                            className="w-full p-3 h-28 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Add any preferences or details..."
                        ></textarea>
                    </div>

                    <NGOSelector
                        donationType="charity_general"
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
                            By confirming this box, you acknowledge that your donation is voluntary,
                            unconditional, and intended solely for humanitarian purposes.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-violet-700 hover:bg-violet-800 transition rounded-xl py-3 text-lg font-bold">
                        Submit General Charity
                    </button>

                </form>
            </div>
        </div>
    );
}
