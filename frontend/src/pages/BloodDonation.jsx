import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../api";
import NGOSelector from "../components/NGOSelector";

export default function BloodDonation() {
    const navigate = useNavigate();

    const [bloodType, setBloodType] = useState(null);
    const [gender, setGender] = useState(null);
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState(""); // ✅ بدل age
    const [phone, setPhone] = useState("");
    const [lastDonationDate, setLastDonationDate] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const handleSubmit = async (e) => {
        e.preventDefault();
       

        // ✅ تحقق بدل العمر
    if (
    !bloodType ||
    !gender ||
    !fullName.trim() ||
    !birthDate ||
    !phone.trim() ||
    !selectedNgoId
) {
    alert("Please complete all required fields.");
    return;
}
if (!/^\d{9,15}$/.test(phone.trim())) {
    alert("Please enter a valid phone number using digits only.");
    return;
}

        // ✅ JSON
const data = {
    donation_type: "blood",
    title: "Blood Donation",

    guest_name: fullName,
    guest_phone: phone,

    donor_birth_date: birthDate,
    donor_gender: gender,
    donor_blood_type: bloodType,
    donor_last_donation_date: lastDonationDate || null,

    description: `Blood donation submitted by ${fullName}.`
    ,
    assigned_ngo_id: selectedNgoId
};
        try {
            await createDonationApi(data);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit blood donation.");
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black flex items-center justify-center text-white">
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl max-w-xl w-full text-center border border-white/20">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-6">Thank you for your generosity.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-2 mb-6">
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p><span className="text-gray-400">Date of Birth:</span> {birthDate}</p>
                        <p><span className="text-gray-400">Gender:</span> {gender}</p>
                        <p><span className="text-gray-400">Blood Type:</span> {bloodType}</p>
                        <p><span className="text-gray-400">Phone:</span> {phone}</p>
                    </div>

                    <button
                        onClick={() => navigate("/categorization")}
                        className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-black py-16 px-6 text-white">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl">

                <button onClick={() => window.history.back()} className="mb-6 text-white/70">
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">Blood Donation Form 🩸</h1>

                <form className="space-y-8" onSubmit={handleSubmit}>

                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20"
                        />
                    </div>

                    {/* ✅ تاريخ الميلاد بدل العمر */}
                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            required
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20"
                        />
                    </div>

                    <div>
                        <label>Gender</label>
                        <div className="grid grid-cols-2 gap-4">
                            {["Male", "Female"].map((g) => (
                                <div
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`p-4 text-center rounded-xl cursor-pointer ${gender === g ? "bg-red-600" : "bg-white/10"
                                        }`}
                                >
                                    {g}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label>Blood Type</label>
                        <div className="grid grid-cols-4 gap-3">
                            {bloodTypes.map((type) => (
                                <div
                                    key={type}
                                    onClick={() => setBloodType(type)}
                                    className={`p-3 text-center rounded-xl cursor-pointer ${bloodType === type ? "bg-red-600" : "bg-white/10"
                                        }`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label>Phone</label>
                        <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20"
                        />
                    </div>

                    <div>
                        <label>Last Donation Date</label>
                        <input
                            type="date"
                            value={lastDonationDate}
                            onChange={(e) => setLastDonationDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20"
                        />
                    </div>

                    <NGOSelector
                        donationType="blood"
                        selectedNgoId={selectedNgoId}
                        onChange={setSelectedNgoId}
                    />

                    <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold">
                        Submit Blood Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
