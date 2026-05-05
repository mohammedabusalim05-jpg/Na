import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function OrganDonation() {
    const navigate = useNavigate();

    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [otherOrgan, setOtherOrgan] = useState("");
    const [gender, setGender] = useState(null);
    const [agreement, setAgreement] = useState(false);

    // Form fields
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(""); // ✅ بدل age
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");

    const [submitted, setSubmitted] = useState(false);

    const organs = [
        "Kidney",
        "Liver",
        "Heart (after death)",
        "Lung",
        "Pancreas",
        "Intestine",
        "Cornea",
        "Skin Tissue",
        "Bone",
        "Bone Marrow",
        "Tendons",
        "Heart Valves",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gender) return;
        if (!selectedOrgan) return;
        if (selectedOrgan === "Other" && otherOrgan.trim() === "") return;
        if (!selectedNgoId) return;
        if (!agreement) return;

        const organName = selectedOrgan === "Other" ? otherOrgan : selectedOrgan;

        const formData = new FormData();
        formData.append("title", "Organ Donation");
        formData.append("donation_type", "organ");
        formData.append(
            "description",
            `Name: ${fullName}
Date of Birth: ${dateOfBirth}
Gender: ${gender}
Organ: ${organName}
Phone: ${phone}
City: ${city}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Request Submitted!</h2>
                    <p className="text-gray-300 mb-8">Your decision can save lives. Thank you.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Organ Donation</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p><span className="text-gray-400">Date of Birth:</span> {dateOfBirth}</p>
                        <p><span className="text-gray-400">Gender:</span> {gender}</p>
                        <p>
                            <span className="text-gray-400">Organ:</span>
                            <span className="text-purple-400 font-bold ml-1">
                                {selectedOrgan === "Other" ? otherOrgan : selectedOrgan}
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black py-16 px-6 text-white">

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in">

                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Organ Donation Form 🫀
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Your decision can save lives. Please fill in your donation details.
                </p>

                <form className="space-y-8" onSubmit={handleSubmit}>

                    {/* FULL NAME */}
                    <div>
                        <label className="block text-lg mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* DATE OF BIRTH */}
                    <div>
                        <label className="block text-lg mb-2">Date of Birth</label>
                        <input
                            type="date"
                            required
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                        />
                    </div>

                    {/* GENDER */}
                    <div>
                        <label className="block text-lg mb-3">Gender</label>
                        <div className="grid grid-cols-2 gap-4">
                            {["Male", "Female"].map((g) => (
                                <div
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                                    ${gender === g
                                            ? "bg-purple-600/60 border-purple-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"}`}
                                >
                                    <span className="font-semibold text-lg">{g}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ORGANS */}
                    <div>
                        <label className="block text-lg mb-3">
                            Select the Organ You Wish to Donate
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {organs.map((organ, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedOrgan(organ)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg 
                                    ${selectedOrgan === organ
                                            ? "bg-purple-600/60 border-purple-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"}`}
                                >
                                    <span className="font-semibold">{organ}</span>
                                </div>
                            ))}
                        </div>

                        {selectedOrgan === "Other" && (
                            <input
                                type="text"
                                className="w-full mt-4 p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                                placeholder="Specify the organ you wish to donate"
                                value={otherOrgan}
                                onChange={(e) => setOtherOrgan(e.target.value)}
                            />
                        )}
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="block text-lg mb-2">Phone Number</label>
                        <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="07XXXXXXXX"
                        />
                    </div>

                    {/* CITY */}
                    <div>
                        <label className="block text-lg mb-2">City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Your city"
                        />
                    </div>

                    <NGOSelector
                        donationType="organ"
                        selectedNgoId={selectedNgoId}
                        onChange={setSelectedNgoId}
                    />

                    {/* CONSENT AGREEMENT – بدون أي تغيير */}
                    <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-lg">
                        <p className="text-sm text-gray-200 mb-3">
                            I formally declare my full understanding and acceptance of the Organ Donation Consent Agreement.
                            I confirm that I am providing my consent voluntarily, with full awareness of the medical and legal implications associated with organ donation.
                            I also confirm that all information submitted in this form is accurate to the best of my knowledge.
                        </p>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5"
                                checked={agreement}
                                onChange={(e) => setAgreement(e.target.checked)}
                            />
                            <span>I agree to the donation consent agreement</span>
                        </label>
                    </div>

                    <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 text-lg font-bold">
                        Submit Organ Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
