import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../../api/index";
import NGOSelector from "../../components/NGOSelector";



const donationTypes = [
    "blood",                // Blood Donation
    "organ",                // Organ Donation
    "money",                // Financial Donation
    "food",                 // Food Donation
    "clothes",              // Clothes Donation
    "medical",              // Medical Equipment
    "education",            // Education Support
    "furniture",            // Furniture Donation
    "household",            // Household Items
    "water",                // Clean Water
    "baby",                 // Baby Supplies
    "toys",                 // Toys Donation
    "electronics",          // Electronics
    "cleaning",             // Cleaning Supplies
    "medicine_support",     // Medicine Support
    "pets",                 // Pet Support & Adoption
    "volunteer",            // Volunteer Time
    "skills",               // Professional Help / Skills
    "families",             // Family Support
    "refugees",             // Refugee Support
    "orphans",              // Orphan Sponsorship
    "charity_general",      // General Charity
    "food_coupons",         // Food Coupons
    "adahi",                // Adahi / Sacrifice
    "housing"               // Housing / Shelter Support
];




export default function CreateDonation() {
    const [donation_type, setDonationType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedNgoId) {
            alert("Please choose an NGO / organization.");
            return;
        }

        setLoading(true);

        const form = new FormData();

        // REQUIRED FIELDS
        form.append("donation_type", donation_type);
        form.append("title", title);
        form.append("description", description);
        form.append("assigned_ngo_id", selectedNgoId);

        // ✅ ADD THESE (THIS IS THE FIX)
        form.append("guest_name", "Guest User");
        form.append("guest_email", "guest@nakhwa.com");
        form.append("guest_phone", "0000000000");

        // OPTIONAL FIELDS
        if (location) form.append("location", location);
        if (image) form.append("image", image);

        try {
            const res = await createDonationApi(form);

            alert("Donation Created Successfully!");
            console.log("CREATED FROM FRONT:", res.data);

            // Navigate to donations list or dashboard
            navigate("/history");

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data
                ? JSON.stringify(err.response.data)
                : err.message;
            alert("Error creating donation: " + errorMsg);
        }

        setLoading(false);
    };


    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Donation</h2>

                {/* Select Category */}
                <label className="block mb-2 font-medium text-gray-700">Donation Type</label>
                <select
                    className="w-full p-3 rounded-lg bg-white/60 border border-gray-300 mb-4"
                    value={donation_type}
                    onChange={(e) => setDonationType(e.target.value)}
                    required
                >
                    <option value="">-- Select Donation Type --</option>
                    {donationTypes.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                    ))}
                </select>

                {donation_type && (
                    <div className="mb-4 rounded-xl bg-slate-950/80 p-4">
                        <NGOSelector
                            donationType={donation_type}
                            selectedNgoId={selectedNgoId}
                            onChange={setSelectedNgoId}
                        />
                    </div>
                )}

                {/* Title */}
                <label className="block mb-2 font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white/60 border border-gray-300 mb-4"
                    placeholder="Enter donation title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {/* Description */}
                <label className="block mb-2 font-medium text-gray-700">Description</label>
                <textarea
                    className="w-full p-3 rounded-lg bg-white/60 border border-gray-300 mb-4"
                    rows="4"
                    placeholder="Describe your donation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                {/* Location */}
                <label className="block mb-2 font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white/60 border border-gray-300 mb-4"
                    placeholder="Location (optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                {/* Image Upload */}
                <label className="block mb-2 font-medium text-gray-700">Upload Image (optional)</label>
                <input
                    type="file"
                    className="mb-6"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                    {loading ? "Creating..." : "Create Donation"}
                </button>
            </form>
        </div>
    );
}
