import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function WaterDonation() {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    const [otherType, setOtherType] = useState("");
    const [condition, setCondition] = useState(null);
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const waterTypes = [
        "Bottled Water (Small)",
        "Bottled Water (Large)",
        "Water Gallons",
        "Filtered Water Packs",
        "Cold Water Packs",
        "Mineral Water Boxes",
    ];

    const conditions = ["Factory Sealed", "Good Condition", "Opened but Clean"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedType && otherType.trim() === "") return;
        if (!condition) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const item = selectedType || otherType;

        const formData = new FormData();
        formData.append("title", "Water Donation");
        formData.append("donation_type", "water");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Item: ${item}
        Condition: ${condition}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Successful!</h2>
                    <p className="text-gray-300 mb-8">Every drop counts. Thank you!</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Water Donation</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Item:</span>
                            <span className="text-blue-400 font-bold ml-1">
                                {selectedType || otherType}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Condition:</span> {condition}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black py-16 px-6 text-white">

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl 
      border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Water Donation Form 💧
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Help families and individuals by donating clean drinking water.
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
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
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
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
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
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Your city"
                        />
                    </div>

                    {/* Water Types Grid */}
                    <div>
                        <label className="block text-lg mb-3">Select Water Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {waterTypes.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedType(item);
                                        setOtherType("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${selectedType === item
                                            ? "bg-blue-600/60 border-blue-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OTHER Type */}
                    <div>
                        <label className="block text-lg mb-2">Other (if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter custom water donation type"
                            value={otherType}
                            onChange={(e) => {
                                setOtherType(e.target.value);
                                setSelectedType(null);
                            }}
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-lg mb-2">Quantity</label>
                        <input
                            type="number"
                            required
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Number of units"
                        />
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-lg mb-3">Water Condition</label>

                        <div className="grid grid-cols-3 gap-4">
                            {conditions.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => setCondition(c)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${condition === c
                                            ? "bg-blue-600/60 border-blue-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload Image */}
                    <div>
                        <label className="block text-lg mb-2">Upload Photo (optional)</label>
                        <input
                            type="file"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg"
                        />
                    </div>

                    <NGOSelector
                        donationType="water"
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
                            By submitting this form, you confirm that the water items provided
                            are safe for consumption and suitable for donation purposes.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition 
          rounded-xl py-3 text-lg font-bold">
                        Submit Water Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
