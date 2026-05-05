import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../api";
import NGOSelector from "../components/NGOSelector";

export default function FamilySupport() {
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

    const supportTypes = [
        "Support for Widowed Families",
        "Support for Single-Parent Families",
        "Support for Families with Special Needs",
        "Support for Large Families",
        "Support for Homeless Families",
        "Emergency Family Assistance",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            (!selectedType && !otherType.trim()) ||
            !agree ||
            !fullName ||
            !phone ||
            !city ||
            !selectedNgoId
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const supportCategory = selectedType || otherType;

        const formData = new FormData();
        formData.append("title", "Family Support Donation");
        formData.append("donation_type", "families");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Support Category: ${supportCategory}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        try {
            await createDonationApi(formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit family support donation.");
        }
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for supporting families in need.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Family Support</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Category:</span>
                            <span className="text-rose-400 font-bold ml-1">
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
        <div className="min-h-screen bg-gradient-to-br from-rose-900 via-slate-900 to-black py-16 px-6 text-white">

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl
      border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in">

                {/* BACK */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                {/* TITLE */}
                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Family Support 👨‍👩‍👧‍👦
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Provide essential support for families in need.
                    Select the type of assistance you can offer.
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

                    {/* Support Types */}
                    <div>
                        <label className="block text-lg mb-3">Select Support Type</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {supportTypes.map((type, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedType(type)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                ${selectedType === type
                                            ? "bg-rose-600/60 border-rose-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OTHER TYPE */}
                    <div>
                        <label className="block text-lg mb-2">
                            Other Type of Support (optional)
                        </label>
                        <input
                            type="text"
                            value={otherType}
                            onChange={(e) => setOtherType(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Describe another type of family support"
                        />
                    </div>

                    {/* Attach File */}
                    <div>
                        <label className="block text-lg mb-2">
                            Attach Supporting Document (optional)
                        </label>
                        <input
                            type="file"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                        />
                    </div>

                    <NGOSelector
                        donationType="families"
                        selectedNgoId={selectedNgoId}
                        onChange={setSelectedNgoId}
                    />

                    {/* AGREEMENT */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className="w-5 h-5 mt-1"
                        />
                        <p className="text-sm text-gray-300">
                            By checking this box, you formally acknowledge that all
                            information you provided is accurate and that you agree
                            to the Family Support Participation Agreement.
                        </p>
                    </div>

                    {/* SUBMIT */}
                    <button className="w-full mt-4 bg-rose-600 hover:bg-rose-700 transition rounded-xl py-3 text-lg font-bold">
                        Submit Family Support
                    </button>

                </form>
            </div>
        </div>
    );
}
