import { useState } from "react";
import api from "../api/index";
import NGOSelector from "../components/NGOSelector";

export default function CreateDonation() {
    const [donation_type, setType] = useState("blood");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedNgoId, setSelectedNgoId] = useState("");

    // Guest State
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");

    const isLoggedIn = !!localStorage.getItem("access_token");

    const handleCreate = (e) => {
        e.preventDefault();

        if (!selectedNgoId) {
            alert("Please choose an NGO / organization.");
            return;
        }

        const payload = {
            donation_type,
            title,
            description,
            assigned_ngo_id: selectedNgoId,
        };

        if (!isLoggedIn) {
            payload.guest_name = guestName;
            payload.guest_email = guestEmail;
            payload.guest_phone = guestPhone;
        }

        api.post("/donations/create/", payload)
            .then((res) => {
                alert("Donation Created Successfully!");
                console.log(res.data);
                // Reset form
                setTitle("");
                setDescription("");
            })
            .catch((err) => {
                console.error(err);
                alert("Error creating donation");
            });
    };

    return (
        <div className="min-h-screen p-6 text-white flex flex-col items-center">
            <header className="w-full max-w-md mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="text-white/70 hover:text-white mb-4 transition"
                >
                    ← Back
                </button>
                <h1 className="text-3xl font-bold">Create Donation</h1>
                {!isLoggedIn && (
                    <p className="text-yellow-400 text-sm mt-2">
                        You are submitting as a Guest.
                    </p>
                )}
            </header>

            <form className="space-y-4 w-full max-w-md bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-lg" onSubmit={handleCreate}>

                <select
                    value={donation_type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 bg-white/10 rounded-xl border border-white/20 focus:outline-none"
                >
                    <option value="blood" className="text-black">Blood Donation</option>
                    <option value="organ" className="text-black">Organ Donation</option>
                    <option value="money" className="text-black">Financial Donation</option>
                    <option value="food" className="text-black">Food Donation</option>
                    <option value="clothes" className="text-black">Clothes Donation</option>
                    <option value="medicine_support" className="text-black">Medical Support</option>
                    {/* Add more as needed matching backend choices */}
                </select>

                <NGOSelector
                    donationType={donation_type}
                    selectedNgoId={selectedNgoId}
                    onChange={setSelectedNgoId}
                />

                <input
                    type="text"
                    placeholder="Donation Title"
                    className="w-full p-3 bg-white/10 rounded-xl border border-white/20 focus:outline-none placeholder-gray-400"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    className="w-full p-3 bg-white/10 rounded-xl border border-white/20 focus:outline-none placeholder-gray-400"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                />

                {!isLoggedIn && (
                    <div className="space-y-4 pt-4 border-t border-white/20">
                        <h3 className="text-lg font-semibold">Guest Contact Info</h3>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full p-3 bg-white/10 rounded-xl border border-white/20 focus:outline-none"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email (Optional)"
                            className="w-full p-3 bg-white/10 rounded-xl border border-white/20 focus:outline-none"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number (Optional)"
                            className="w-full p-3 bg-white/10 rounded-xl border border-white/20 focus:outline-none"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                        />
                    </div>
                )}

                <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition transform active:scale-95">
                    {isLoggedIn ? "Create Donation" : "Submit as Guest"}
                </button>
            </form>
        </div>
    );
}
