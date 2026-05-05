import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/index";
import toast from "react-hot-toast";

const donationTypes = [
    "blood", "organ", "money", "food", "adahi", "clothes", "furniture",
    "medical", "household", "water", "baby", "toys", "education",
    "electronics", "cleaning", "medicine_support", "pets", "volunteer",
    "skills", "families", "refugees", "orphans", "charity_general",
    "food_coupons"
];

export default function RequestAid() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        category: "",
        description: "",
    });
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        form.append("name", formData.name);
        form.append("phone", formData.phone);
        form.append("category", formData.category);
        form.append("description", formData.description);
        if (proof) {
            form.append("proof_document", proof);
        }

        try {
            await api.post("/donations/requests/create/", form, {
                // Let browser handle boundary
            });
            toast.success("Request Submitted! Admin will review it soon.");
            navigate("/"); // Or to a confirmation page
        } catch (error) {
            console.error(error);
            const msg = error.response?.data ? JSON.stringify(error.response.data) : "Failed to submit request";
            toast.error(msg);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex justify-center items-center p-6">
            <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl">
                <Link to="/" className="text-gray-400 hover:text-white mb-6 inline-block">← Back Home</Link>

                <h1 className="text-3xl font-bold mb-2">Request Aid ❤️</h1>
                <p className="text-gray-300 mb-6 text-sm">
                    We know it takes courage to ask. Please fill in the details so we can verify and help you effectively.
                    <br />Your privacy is important to us.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type of Help Needed</label>
                        <select
                            required
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-200"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" className="text-black">-- Select Category --</option>
                            {donationTypes.map(t => (
                                <option key={t} value={t} className="text-black">{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description of Need</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="Please explain your situation..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    {/* Proof Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Upload Proof (Photo/Document)</label>
                        <p className="text-xs text-gray-400 mb-2">Please upload a relevant document (ID, Medical Report, Bill, etc.) to help us verify your request.</p>
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-600 file:text-white
                            hover:file:bg-blue-700
                            "
                            onChange={(e) => setProof(e.target.files[0])}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg mt-4 disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            </div>
        </div>
    );
}
