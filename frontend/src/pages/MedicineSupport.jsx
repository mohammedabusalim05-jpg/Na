import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function MedicineSupport() {
    const navigate = useNavigate();

    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [otherMedicine, setOtherMedicine] = useState("");
    const [condition, setCondition] = useState(null);
    const [type, setType] = useState(null);
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const medicines = [
        "Painkillers (Panadol, Advil)",
        "Allergy Medicine",
        "Antibiotics (Sealed Only)",
        "Cough Syrup",
        "Asthma Inhalers",
        "Diabetes Medication",
        "Blood Pressure Medicine",
        "Vitamins",
        "First Aid Supplies",
        "Eye Drops",
        "Skin Creams",
        "Antiseptic Solutions",
    ];

    const conditions = [
        "New – Sealed",
        "Opened but safe",
        "Expires soon",
        "Valid for 3+ months",
    ];

    const types = ["Prescription", "Over-the-counter"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMedicine && otherMedicine.trim() === "") return;
        if (!condition) return;
        if (!type) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const medicine = selectedMedicine || otherMedicine;

        const formData = new FormData();
        formData.append("title", "Medicine Support");
        formData.append("donation_type", "medicine_support");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Medicine: ${medicine}
        Condition: ${condition}
        Type: ${type}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for supporting medicine needs.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Medicine Support</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Medicine:</span>
                            <span className="text-indigo-400 font-bold ml-1">
                                {selectedMedicine || otherMedicine}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Condition:</span> {condition}</p>
                        <p><span className="text-gray-400">Type:</span> {type}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black py-16 px-6 text-white">

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
                    Medicine Support Donation 💊
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Provide essential medical support for families in need.
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

                    {/* Medicine Grid */}
                    <div>
                        <label className="block text-lg mb-3">Select Medicine Type</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {medicines.map((m, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedMedicine(m);
                                        setOtherMedicine("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${selectedMedicine === m
                                            ? "bg-indigo-700/60 border-indigo-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Medicine */}
                    <div>
                        <label className="block text-lg mb-2">Other Medicine (if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Type medicine name"
                            value={otherMedicine}
                            onChange={(e) => {
                                setOtherMedicine(e.target.value);
                                setSelectedMedicine(null);
                            }}
                        />
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-lg mb-3">Medicine Condition</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {conditions.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => setCondition(c)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${condition === c
                                            ? "bg-indigo-700/60 border-indigo-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prescription or not */}
                    <div>
                        <label className="block text-lg mb-3">Medicine Type</label>

                        <div className="grid grid-cols-2 gap-4">
                            {types.map((t) => (
                                <div
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${type === t
                                            ? "bg-indigo-700/60 border-indigo-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload Photo */}
                    <div>
                        <label className="block text-lg mb-2">Upload Photo (optional)</label>
                        <input
                            type="file"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                            You may upload a picture of the medicine.
                        </p>
                    </div>

                    <NGOSelector
                        donationType="medicine_support"
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
                            By confirming this agreement, you officially declare that the provided
                            medical items are safe, valid, and donated voluntarily without any conditions.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-indigo-700 hover:bg-indigo-800 transition rounded-xl py-3 text-lg font-bold">
                        Submit Medicine Support Donation
                    </button>

                </form>

            </div>
        </div>
    );
}
