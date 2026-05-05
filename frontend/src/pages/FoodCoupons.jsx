import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../api";
import NGOSelector from "../components/NGOSelector";
export default function FoodCoupons() {
    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState(null);
    const [couponType, setCouponType] = useState(null);
    const [otherNote, setOtherNote] = useState("");
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const couponValues = [
        "5 JOD",
        "10 JOD",
        "15 JOD",
        "20 JOD",
        "25 JOD",
        "30 JOD",
        "50 JOD",
    ];

    const couponTypes = [
        "Supermarket Food Coupon",
        "Restaurant Meal Coupon",
        "Bread Coupons",
        "Vegetables & Fruits",
        "Meat & Chicken Coupon",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !selectedValue ||
            (!couponType && !otherNote.trim()) ||
            !agree ||
            !fullName ||
            !phone ||
            !city ||
            !selectedNgoId
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const couponCategory = couponType || otherNote;

        const formData = new FormData();
        formData.append("title", "Food Coupons Donation");
        formData.append("donation_type", "food_coupons");
        formData.append(
            "description",
            `Name: ${fullName}
             Phone: ${phone}
             City: ${city}
             Coupon Value: ${selectedValue}
             Category: ${couponCategory}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        try {
            await createDonationApi(formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit food coupon donation.");
        }
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for funding food coupons.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Food Coupons</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Coupon Value:</span>
                            <span className="text-fuchsia-400 font-bold ml-1">
                                {selectedValue}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Category:</span> {couponType || otherNote}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-slate-900 to-black py-16 px-6 text-white">

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
                    Food Coupons Donation 🎟️
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Support families by offering prepaid food coupons they can use when needed.
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

                    {/* Coupon Value */}
                    <div>
                        <label className="block text-lg mb-3">Select Coupon Value</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {couponValues.map((value, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedValue(value)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                                        ${selectedValue === value
                                            ? "bg-fuchsia-700/60 border-fuchsia-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coupon Type */}
                    <div>
                        <label className="block text-lg mb-3">Choose Coupon Category</label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {couponTypes.map((type, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setCouponType(type);
                                        setOtherNote("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                                        ${couponType === type
                                            ? "bg-fuchsia-700/60 border-fuchsia-300"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Note */}
                    <div>
                        <label className="block text-lg mb-2">Other Type (optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Type any specific coupon detail"
                            value={otherNote}
                            onChange={(e) => {
                                setOtherNote(e.target.value);
                                setCouponType(null);
                            }}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-lg mb-2">Additional Notes (optional)</label>
                        <textarea
                            className="w-full p-3 h-28 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Add any important notes..."
                        ></textarea>
                    </div>

                    <NGOSelector
                        donationType="food_coupons"
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
                            By confirming this box, you acknowledge that the food coupon donation
                            is voluntary and intended solely to support families in need.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-fuchsia-700 hover:bg-fuchsia-800 transition rounded-xl py-3 text-lg font-bold">
                        Submit Food Coupon Donation
                    </button>

                </form>

            </div>
        </div>
    );
}
