import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function FoodDonation() {
    const navigate = useNavigate();

    const [foodType, setFoodType] = useState(null);
    const [otherFood, setOtherFood] = useState("");

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const categories = [
        "Food Basket",
        "Ready Meals",
        "Vegetables & Fruits",
        "Meat & Poultry",
        "Canned Food",
        "Bread",
        "Drinking Water",
        "Dry Goods",
        "Dairy Products",
        "Sweets & Desserts",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            (!foodType && otherFood.trim() === "") ||
            !fullName ||
            !phone ||
            !city ||
            !selectedNgoId
        ) {
            return;
        }

        const foodCategory = foodType || otherFood;

        const formData = new FormData();
        formData.append("title", "Food Donation");
        formData.append("donation_type", "food");
        formData.append(
            "description",
            `Name: ${fullName}
        Phone: ${phone}
        City: ${city}
        Food Items: ${foodCategory}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for your food donation.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Food Donation</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Items:</span>
                            <span className="text-green-400 font-bold ml-1">
                                {foodType || otherFood}
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
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-black py-16 px-6 text-white">

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20
      p-10 rounded-3xl shadow-xl">

                {/* Back */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Food Donation Form 🍱
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Support families in need by donating food items.
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

                    {/* FOOD TYPE SELECT */}
                    <div>
                        <label className="block text-lg mb-3">Select Food Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {categories.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setFoodType(item);
                                        setOtherFood("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${foodType === item
                                            ? "bg-green-600/60 border-green-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    <span className="font-semibold">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OTHER FOOD OPTION */}
                    <div>
                        <label className="block text-lg mb-2">Other (Specify if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter custom food donation"
                            value={otherFood}
                            onChange={(e) => {
                                setOtherFood(e.target.value);
                                setFoodType(null);
                            }}
                        />
                    </div>

                    {/* NOTES */}
                    <div>
                        <label className="block text-lg mb-2">Additional Notes (optional)</label>
                        <textarea
                            className="w-full p-3 h-28 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Write any extra details about your donation"
                        ></textarea>
                    </div>

                    <NGOSelector
                        donationType="food"
                        selectedNgoId={selectedNgoId}
                        onChange={setSelectedNgoId}
                    />

                    {/* Submit */}
                    <button className="w-full mt-4 bg-green-600 hover:bg-green-700 transition rounded-xl py-3 text-lg font-bold">
                        Submit Food Donation
                    </button>

                </form>

            </div>
        </div>
    );
}
