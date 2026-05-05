import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../api";
import NGOSelector from "../components/NGOSelector";

export default function ClothesDonation() {
    const navigate = useNavigate();

    const [clothingType, setClothingType] = useState(null);
    const [ageGroup, setAgeGroup] = useState(null);
    const [condition, setCondition] = useState(null);
    const [otherClothes, setOtherClothes] = useState("");
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const clothingCategories = [
        "Shirts",
        "Pants",
        "Dresses",
        "Jackets",
        "Shoes",
        "Winter Clothes",
        "Scarves & Hats",
        "Sportswear",
    ];

    const ageGroups = ["Children", "Teens", "Adults", "Elderly"];

    const conditions = ["New", "Like New", "Good Condition"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            (!clothingType && otherClothes.trim() === "") ||
            !ageGroup ||
            !condition ||
            !agree ||
            !fullName ||
            !phone ||
            !city ||
            !selectedNgoId
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const clothesName = clothingType || otherClothes;

        const formData = new FormData();
        formData.append("title", "Clothes Donation");
        formData.append("donation_type", "clothes"); // 🔥 مطابق للموديل
        formData.append(
            "description",
            `Name: ${fullName}
            Phone: ${phone}
            City: ${city}
            Item: ${clothesName}
            Age Group: ${ageGroup}
            Condition: ${condition}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        try {
            await createDonationApi(formData); // 🔥 إرسال حقيقي
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit clothes donation.");
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for your clothes donation.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Clothes Donation</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Item:</span>
                            <span className="text-indigo-400 font-bold ml-1">
                                {clothingType || otherClothes}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Age Group:</span> {ageGroup}</p>
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

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 
      p-10 rounded-3xl shadow-xl">

                {/* BACK BUTTON */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Clothes Donation Form 👕
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Donate clothes to support individuals and families in need.
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
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Your city"
                        />
                    </div>

                    {/* CLOTHING TYPE */}
                    <div>
                        <label className="block text-lg mb-3">Select Clothing Type</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {clothingCategories.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setClothingType(item);
                                        setOtherClothes("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${clothingType === item
                                            ? "bg-indigo-600/60 border-indigo-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OTHER CLOTHING */}
                    <div>
                        <label className="block text-lg mb-2">Other (if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter custom clothing type"
                            value={otherClothes}
                            onChange={(e) => {
                                setOtherClothes(e.target.value);
                                setClothingType(null);
                            }}
                        />
                    </div>

                    {/* AGE GROUP */}
                    <div>
                        <label className="block text-lg mb-3">Age Group</label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {ageGroups.map((group) => (
                                <div
                                    key={group}
                                    onClick={() => setAgeGroup(group)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${ageGroup === group
                                            ? "bg-indigo-600/60 border-indigo-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {group}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONDITION */}
                    <div>
                        <label className="block text-lg mb-3">Clothing Condition</label>

                        <div className="grid grid-cols-3 gap-4">
                            {conditions.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => setCondition(c)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${condition === c
                                            ? "bg-indigo-600/60 border-indigo-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* UPLOAD IMAGE */}
                    <div>
                        <label className="block text-lg mb-2">Upload Photo (optional)</label>
                        <input
                            type="file"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg"
                        />
                    </div>

                    <NGOSelector
                        donationType="clothes"
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
                            By confirming, you acknowledge that your donation is voluntary and that
                            the clothes provided are clean and in acceptable condition.
                        </p>
                    </div>

                    {/* SUBMIT */}
                    <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 transition 
          rounded-xl py-3 text-lg font-bold">
                        Submit Clothes Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
