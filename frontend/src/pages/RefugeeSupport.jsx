import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function RefugeeSupport() {
    const navigate = useNavigate();

    const [supportType, setSupportType] = useState(null);
    const [otherType, setOtherType] = useState("");
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const types = [
        "Food Aid",
        "Shelter Support",
        "Clothing",
        "Baby Essentials",
        "Medical Support",
        "Legal Assistance",
        "Education Support",
        "Mental Health Support",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!supportType && !otherType) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const support = supportType || otherType;

        const formData = new FormData();
        formData.append("title", "Refugee Support");
        formData.append("donation_type", "refugees");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Support: ${support}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Support Request Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for standing with refugees.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Refugee Support</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Assistance:</span>
                            <span className="text-sky-400 font-bold ml-1">
                                {supportType || otherType}
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
        <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-900 to-black py-16 px-6 text-white">

            <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 
      backdrop-blur-xl p-10 rounded-3xl shadow-xl">

                {/* BACK BUTTON */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Refugee Support 🛂
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Provide assistance for refugees in need through various forms of support.
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

                    {/* Support Type */}
                    <div>
                        <label className="block text-lg mb-3">Type of Support</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {types.map((t, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSupportType(t)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${supportType === t
                                            ? "bg-sky-600/60 border-sky-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Support */}
                    <div>
                        <label className="block text-lg mb-2">Other Support (optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="If not listed, specify here"
                            value={otherType}
                            onChange={(e) => setOtherType(e.target.value)}
                        />
                    </div>

                    <NGOSelector
                        donationType="refugees"
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
                            By confirming this box, you acknowledge that the provided information
                            is correct and that the assistance will be delivered responsibly
                            and respectfully to refugees in need.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-sky-600 hover:bg-sky-700 transition rounded-xl py-3 text-lg font-bold">
                        Submit Refugee Support
                    </button>

                </form>

            </div>
        </div>
    );
}
