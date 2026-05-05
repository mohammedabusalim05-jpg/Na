import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function ToysDonation() {
    const navigate = useNavigate();

    const [selectedToy, setSelectedToy] = useState(null);
    const [otherToy, setOtherToy] = useState("");
    const [ageGroup, setAgeGroup] = useState(null);
    const [condition, setCondition] = useState(null);
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toys = [
        "Soft Teddy Bears",
        "Educational Toys",
        "Building Blocks",
        "Puzzles",
        "Cars & Trucks",
        "Dolls",
        "Board Games",
        "Drawing & Coloring Kits",
        "Musical Toys",
        "Action Figures",
        "Sports Toys (Balls, Rackets)",
    ];

    const ageGroups = [
        "Toddlers (1–3 years)",
        "Kids (4–6 years)",
        "Kids (7–10 years)",
        "Teens (11–15 years)",
    ];

    const conditions = ["New", "Good Condition", "Used but Clean"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedToy && otherToy.trim() === "") return;
        if (!ageGroup) return;
        if (!condition) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const toyName = selectedToy || otherToy;

        const formData = new FormData();
        formData.append("title", "Toys Donation");
        formData.append("donation_type", "toys");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Toy: ${toyName}
        Age Group: ${ageGroup}
        Condition: ${condition}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-700 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Successful!</h2>
                    <p className="text-gray-300 mb-8">You're bringing joy to a child!</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Toys Donation</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Toy:</span>
                            <span className="text-yellow-400 font-bold ml-1">
                                {selectedToy || otherToy}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Age:</span> {ageGroup}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-yellow-700 via-slate-900 to-black py-16 px-6 text-white">
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
                    Kids Toys Donation 🧸
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Donate toys to bring joy and happiness to children in need.
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

                    {/* Toys Grid */}
                    <div>
                        <label className="block text-lg mb-3">Select Toy</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {toys.map((toy, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedToy(toy);
                                        setOtherToy("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${selectedToy === toy
                                            ? "bg-yellow-600/60 border-yellow-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {toy}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OTHER toy */}
                    <div>
                        <label className="block text-lg mb-2">Other Toy (if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter toy name"
                            value={otherToy}
                            onChange={(e) => {
                                setOtherToy(e.target.value);
                                setSelectedToy(null);
                            }}
                        />
                    </div>

                    {/* Age Group */}
                    <div>
                        <label className="block text-lg mb-3">Age Group</label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {ageGroups.map((group) => (
                                <div
                                    key={group}
                                    onClick={() => setAgeGroup(group)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${ageGroup === group
                                            ? "bg-yellow-600/60 border-yellow-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {group}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-lg mb-3">Toy Condition</label>

                        <div className="grid grid-cols-3 gap-4">
                            {conditions.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => setCondition(c)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                    ${condition === c
                                            ? "bg-yellow-600/60 border-yellow-400"
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
                        donationType="toys"
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
                            By submitting this form, you confirm that the toys are safe, clean,
                            and appropriate for children to use.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 transition 
            rounded-xl py-3 text-lg font-bold">
                        Submit Toy Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
