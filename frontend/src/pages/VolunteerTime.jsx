import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function VolunteerTime() {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [otherType, setOtherType] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [otherSkill, setOtherSkill] = useState("");
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const volunteerTypes = [
        "Field Volunteering",
        "Office Work",
        "Event Support",
        "Distribution of Aid",
        "Social Support",
        "Teaching / Training",
        "Translation",
        "Medical Assistance (Qualified Only)",
    ];

    const skills = [
        "Communication",
        "Teamwork",
        "Problem Solving",
        "First Aid",
        "Driving",
        "Photography",
        "Computer Skills",
    ];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedType && !otherType) return;
        if (selectedDays.length === 0) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const role = selectedType || otherType;
        const skillsText = [...selectedSkills, otherSkill].filter(Boolean).join(", ");

        const formData = new FormData();
        formData.append("title", "Volunteer Time");
        formData.append("donation_type", "volunteer");
        formData.append(
            "description",
            `Name: ${fullName}
            Phone: ${phone}
            City: ${city}
            Role: ${role}
            Days: ${selectedDays.join(", ")}
            Skills: ${skillsText}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Registered as Volunteer!</h2>
                    <p className="text-gray-300 mb-8">Welcome to the team!</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Volunteering</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Role:</span>
                            <span className="text-gray-400 font-bold ml-1">
                                {selectedType || otherType}
                            </span>
                        </p>
                        <p><span className="text-gray-400">Days:</span> {selectedDays.join(", ")}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-16 px-6 text-white">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl">

                {/* Back */}
                <button onClick={() => window.history.back()} className="mb-6 text-white/70 hover:text-white transition">
                    ← Back
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-6">Volunteer Time ⏳</h1>
                <p className="text-center text-gray-300 mb-10">
                    Support your community by offering your time, skills, and experience.
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

                    {/* Volunteering Type */}
                    <div>
                        <label className="block text-lg mb-3">Select Type of Volunteering</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {volunteerTypes.map((t, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedType(t);
                                        setOtherType("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg ${selectedType === t
                                        ? "bg-gray-700/70 border-gray-400"
                                        : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {t}
                                </div>
                            ))}

                            {/* Other Type */}
                            <div
                                onClick={() => {
                                    setSelectedType(null);
                                }}
                                className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg ${!selectedType && otherType
                                    ? "bg-gray-700/70 border-gray-400"
                                    : "bg-white/10 border-white/20 hover:bg-white/20"
                                    }`}
                            >
                                Other
                            </div>
                        </div>

                        {/* Other Type Input */}
                        {!selectedType && (
                            <input
                                type="text"
                                className="w-full mt-4 p-3 rounded-xl bg-white/20 border border-white/30"
                                placeholder="Specify your volunteering type"
                                value={otherType}
                                onChange={(e) => setOtherType(e.target.value)}
                            />
                        )}
                    </div>

                    {/* Available Days */}
                    <div>
                        <label className="block text-lg mb-3">Available Days</label>

                        <div className="grid grid-cols-3 gap-3">
                            {days.map((day, i) => (
                                <div
                                    key={i}
                                    onClick={() => toggleDay(day)}
                                    className={`p-3 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg ${selectedDays.includes(day)
                                        ? "bg-gray-700/70 border-gray-400"
                                        : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hours */}
                    <div>
                        <label className="block text-lg mb-2">Available Hours Per Week</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="e.g. 5 hours"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-lg mb-3">Skills You Can Offer</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {skills.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => toggleSkill(s)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg ${selectedSkills.includes(s)
                                        ? "bg-gray-700/70 border-gray-400"
                                        : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Skill */}
                    <div>
                        <label className="block text-lg mb-2">Other Skill (optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30"
                            placeholder="Type your skill"
                            value={otherSkill}
                            onChange={(e) => setOtherSkill(e.target.value)}
                        />
                    </div>

                    {/* Upload CV */}
                    <div>
                        <label className="block text-lg mb-2">Upload CV (optional)</label>
                        <input type="file" className="w-full p-3 rounded-xl bg-white/10 border border-white/20" />
                    </div>

                    <NGOSelector
                        donationType="volunteer"
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
                            By confirming this box, you formally acknowledge your commitment to volunteer responsibly and
                            professionally in accordance with the organization’s guidelines.
                        </p>
                    </div>

                    {/* Submit */}
                    <button className="w-full mt-4 bg-gray-700 hover:bg-gray-800 transition rounded-xl py-3 text-lg font-bold">
                        Submit Volunteer Time
                    </button>
                </form>
            </div>
        </div>
    );
}
