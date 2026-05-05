import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NGOSelector from "../components/NGOSelector";

export default function AdahiDonation() {
    const navigate = useNavigate();

    const [animalType, setAnimalType] = useState(null);
    const [size, setSize] = useState(null);
    const [otherAnimal, setOtherAnimal] = useState("");
    const [agree, setAgree] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const animals = [
        "Sheep",
        "Goat",
        "Cow (Share)",
        "Camel (Share)",
        "Full Cow",
        "Full Camel",
    ];

    const sizes = ["Small", "Medium", "Large"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!animalType && otherAnimal.trim() === "") return;
        if (!size) return;
        if (!selectedNgoId) return;
        if (!agree) return;

        const sacrificeType = animalType || otherAnimal;

        const formData = new FormData();
        formData.append("title", "Adahi Donation");
        formData.append("donation_type", "adahi");
        formData.append(
            "description",
            `Name: ${fullName}
                Phone: ${phone}
                Sacrifice: ${sacrificeType}
                Size: ${size}`
        );
        formData.append("assigned_ngo_id", selectedNgoId);

        await api.post("/donations/create/", formData);
        setSubmitted(true);
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">

                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Donation Submitted!</h2>
                    <p className="text-gray-300 mb-8">Thank you for your Adahi/Sacrifice donation.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Summary</h3>
                        <p><span className="text-gray-400">Type:</span> Adahi / Sacrifice</p>
                        <p><span className="text-gray-400">Name:</span> {fullName}</p>
                        <p>
                            <span className="text-gray-400">Sacrifice:</span>
                            <span className="text-yellow-400 font-bold ml-1">
                                {animalType || otherAnimal} ({size})
                            </span>
                        </p>
                        <p><span className="text-gray-400">Phone:</span> {phone}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-slate-900 to-black py-16 px-6 text-white">

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
                    Adahi / Sacrifice Donation 🐑
                </h1>

                <p className="text-center text-gray-300 mb-10">
                    Contribute by donating a sacrifice to support families in need.
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

                    {/* Animal Type */}
                    <div>
                        <label className="block text-lg mb-3">Select Sacrifice Type</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {animals.map((animal, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setAnimalType(animal);
                                        setOtherAnimal("");
                                    }}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${animalType === animal
                                            ? "bg-yellow-600/60 border-yellow-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {animal}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OTHER OPTION */}
                    <div>
                        <label className="block text-lg mb-2">Other (if not listed)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Enter custom sacrifice type"
                            value={otherAnimal}
                            onChange={(e) => {
                                setOtherAnimal(e.target.value);
                                setAnimalType(null);
                            }}
                        />
                    </div>

                    {/* SIZE */}
                    <div>
                        <label className="block text-lg mb-3">Select Size</label>

                        <div className="grid grid-cols-3 gap-4">
                            {sizes.map((sz) => (
                                <div
                                    key={sz}
                                    onClick={() => setSize(sz)}
                                    className={`p-4 rounded-xl cursor-pointer text-center border transition backdrop-blur-lg
                  ${size === sz
                                            ? "bg-yellow-600/60 border-yellow-400"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                >
                                    {sz}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NOTES */}
                    <div>
                        <label className="block text-lg mb-2">Additional Notes (optional)</label>
                        <textarea
                            className="w-full p-3 h-28 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg"
                            placeholder="Any extra details about the sacrifice donation"
                        ></textarea>
                    </div>

                    <NGOSelector
                        donationType="adahi"
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
                            By confirming, you acknowledge that your sacrifice donation is voluntary,
                            and you authorize us to process and distribute it according to humanitarian guidelines.
                        </p>
                    </div>

                    {/* SUBMIT */}
                    <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 transition 
          rounded-xl py-3 text-lg font-bold">
                        Submit Sacrifice Donation
                    </button>

                </form>
            </div>
        </div>
    );
}
