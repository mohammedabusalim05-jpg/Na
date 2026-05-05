import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function PetSupport() {
    const navigate = useNavigate();

    const [selectedSupply, setSelectedSupply] = useState(null);
    const [otherSupply, setOtherSupply] = useState("");
    const [isAdoption, setIsAdoption] = useState(false);
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const supplies = [
        "Dry Food (Cats)",
        "Dry Food (Dogs)",
        "Wet Food",
        "Pet Toys",
        "Blankets",
        "Leashes",
        "Pet Beds",
        "Medicine",
        "Litter Sand",
        "Grooming Items",
        "Bird Food",
        "Fish Supplies",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAdoption && !selectedSupply && otherSupply.trim() === "") return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const item = isAdoption ? "Pet Adoption" : (selectedSupply || otherSupply);

        const formData = new FormData();
        formData.append("title", "Pet Support");
        formData.append("donation_type", "pets");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Type: ${isAdoption ? "Adoption" : "Supplies"}
        Item: ${item}`
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

                    <h2 className="text-3xl font-bold mb-2">Request Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for helping pets in need.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> {isAdoption ? "Pet Adoption Details" : "Pet Supplies Donation"}</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        {!isAdoption && (
                            <p>
                                <span className="text-gray-400">Item:</span>
                                <span className="text-emerald-400 font-bold ml-1">
                                    {selectedSupply || otherSupply}
                                </span>
                            </p>
                        )}
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-black py-16 px-6 text-white">

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl 
      border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* BACK */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Pet Donation & Adoption 🐾
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Support pets by donating supplies or offering an animal for adoption.
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

                    {/* Donation Type */}
                    <div>
                        <label className="block text-lg mb-3">Choose Donation Type</label>

                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setIsAdoption(false)}
                                className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                ${!isAdoption
                                        ? "bg-emerald-700/60 border-emerald-400"
                                        : "bg-white/10 border-white/20 hover:bg-white/20"
                                    }`}
                            >
                                Pet Supplies
                            </div>

                            <div
                                onClick={() => setIsAdoption(true)}
                                className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                ${isAdoption
                                        ? "bg-emerald-700/60 border-emerald-400"
                                        : "bg-white/10 border-white/20 hover:bg-white/20"
                                    }`}
                            >
                                Pet Adoption
                            </div>
                        </div>
                    </div>

                    {/* IF SUPPLIES */}
                    {!isAdoption && (
                        <>
                            <div>
                                <label className="block text-lg mb-3">Select Supplies to Donate</label>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {supplies.map((item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setSelectedSupply(item);
                                                setOtherSupply("");
                                            }}
                                            className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                      ${selectedSupply === item
                                                    ? "bg-emerald-700/60 border-emerald-400"
                                                    : "bg-white/10 border-white/20 hover:bg-white/20"
                                                }`}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Other */}
                            <div>
                                <label className="block text-lg mb-2">Other Item (if not listed)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                                    placeholder="Type supply name"
                                    value={otherSupply}
                                    onChange={(e) => {
                                        setOtherSupply(e.target.value);
                                        setSelectedSupply(null);
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* IF ADOPTION */}
                    {isAdoption && (
                        <>
                            {/* Pet Type */}
                            <div>
                                <label className="block text-lg mb-2">Pet Type</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                                    placeholder="Dog, Cat, Bird..."
                                />
                            </div>

                            {/* Pet Age */}
                            <div>
                                <label className="block text-lg mb-2">Pet Age</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                                    placeholder="e.g: 2 years"
                                />
                            </div>

                            {/* Pet Notes */}
                            <div>
                                <label className="block text-lg mb-2">Pet Description</label>
                                <textarea
                                    required
                                    className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                                    placeholder="Write details about the pet..."
                                ></textarea>
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="block text-lg mb-2">Upload Pet Photo</label>
                                <input
                                    type="file"
                                    required
                                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                                />
                            </div>
                        </>
                    )}

                    <NGOSelector
                        donationType="pets"
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
                            I hereby confirm that all provided information is accurate and that this donation
                            or adoption request is submitted voluntarily and responsibly.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 transition rounded-xl py-3 text-lg font-bold">
                        Submit Pet Donation
                    </button>

                </form>

            </div>
        </div>
    );
}
