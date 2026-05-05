import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../api";
import NGOSelector from "../components/NGOSelector";
export default function EducationSupport() {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    const [otherType, setOtherType] = useState("");
    const [level, setLevel] = useState(null);
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const supportTypes = [
        "School Books",
        "Notebooks & Stationery",
        "Backpacks",
        "School Uniforms",
        "Laptops / Tablets",
        "Online Learning Devices",
        "Exam Fees Support",
        "Tuition Fees Support",
        "Internet Packages",
        "Course / Training Vouchers",
    ];

    const educationLevels = [
        "Primary School",
        "Middle School",
        "High School",
        "University / College",
        "Special Needs Education",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            (!selectedType && otherType.trim() === "") ||
            !level ||
            !agree ||
            !fullName ||
            !phone ||
            !city ||
            !selectedNgoId
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const supportName = selectedType || otherType;

        const formData = new FormData();
        formData.append("title", "Education Support Donation");
        formData.append("donation_type", "education");
        formData.append(
            "description",
            `Name: ${fullName}
            Phone: ${phone}
            City: ${city}
            Support Type: ${supportName}
            Education Level: ${level}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        try {
            await createDonationApi(formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit education support donation.");
        }
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for supporting education.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Education Support</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Support:</span>
                            <span className="text-sky-400 font-bold ml-1">
                                {selectedType || otherType}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Level:</span> {level}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-900 to-black py-16 px-6 text-white">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 text-white/70 hover:text-white transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">
                    Education Support Donation 🎓
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Help students continue their education by donating learning supplies and support.
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

                    {/* Support Type Grid */}
                    <div>
                        <label className="block text-lg mb-3">Select Education Support Type</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {supportTypes.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedType(item);
                                        setOtherType("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${selectedType === item
                                            ? "bg-sky-600/60 border-sky-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Support Type */}
                    <div>
                        <label className="block text-lg mb-2">Other Support Type (if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter custom education support type"
                            value={otherType}
                            onChange={(e) => {
                                setOtherType(e.target.value);
                                setSelectedType(null);
                            }}
                        />
                    </div>

                    {/* Education Level */}
                    <div>
                        <label className="block text-lg mb-3">Education Level</label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {educationLevels.map((lvl) => (
                                <div
                                    key={lvl}
                                    onClick={() => setLevel(lvl)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${level === lvl
                                            ? "bg-sky-600/60 border-sky-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {lvl}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-lg mb-2">Additional Details (optional)</label>
                        <textarea
                            className="w-full p-3 h-28 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Describe any specific student needs, subjects, or details."
                        ></textarea>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-lg mb-2">Upload Attachment (optional)</label>
                        <input
                            type="file"
                            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                            You may upload a photo of the items or any related document.
                        </p>
                    </div>

                    <NGOSelector
                        donationType="education"
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
                            By submitting this form, you confirm that the provided education support
                            is offered voluntarily and is suitable for use by students in need.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-sky-600 hover:bg-sky-700 transition rounded-xl py-3 text-lg font-bold">
                        Submit Education Support Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
