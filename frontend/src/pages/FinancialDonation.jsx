import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonationApi } from "../api/index"; // Ensure this uses central API
import toast from "react-hot-toast";
import NGOSelector from "../components/NGOSelector";

export default function FinancialDonation() {
    const navigate = useNavigate();

    const [amount, setAmount] = useState("");
    const [purpose, setPurpose] = useState(null);
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [agree, setAgree] = useState(false);

    // Card Details (Mock)
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const presetAmounts = [5, 10, 20, 50, 100, 250];

    const donationPurposes = [
        "Supporting urgent medical cases",
        "Helping families in need",
        "Buying medicine for patients",
        "Contributing to refugee support",
        "Emergency winter aid",
        "General charity donations"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!purpose) {
            toast.error("Please select a cause.");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }
        if (!selectedNgoId) {
            toast.error("Please choose an NGO / organization.");
            return;
        }
        if (cardNumber.length < 13) {
            toast.error("Please enter a valid card number.");
            return;
        }
        if (!agree) {
            toast.error("You must agree to the terms.");
            return;
        }

        setLoading(true);

        // SIMULATE PAYMENT DELAY
        await new Promise(r => setTimeout(r, 2000));

        // Create Donation in Backend
        const formData = new FormData();
        formData.append("title", `Financial Donation: ${purpose}`);
        formData.append("donation_type", "money");
        formData.append("description", `For: ${purpose}. Amount: ${amount} JD`);
        formData.append("amount", amount);
        formData.append("assigned_ngo_id", selectedNgoId);
        // Note: 'amount' field must be supported by backend model now

        try {
            await createDonationApi(formData);
            setSubmitted(true);
            toast.success("Payment Successful!");
        } catch (error) {
            console.error(error);
            toast.error("Payment Processed but Failed to Save Record.");
        }

        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black py-16 px-6 text-white flex items-center justify-center">
                <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <span className="text-4xl">✓</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-gray-300 mb-8">Thank you for your generosity.</p>

                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-3 mb-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Receipt</h3>
                        <p><span className="text-gray-400">Purpose:</span> {purpose}</p>
                        <p>
                            <span className="text-gray-400">Amount Paid:</span>
                            <span className="text-green-400 font-bold ml-1">{amount} JD</span>
                        </p>
                        <p><span className="text-gray-400">Status:</span> Paid via VISA **{cardNumber.slice(-4)}</p>
                    </div>

                    <button
                        onClick={() => navigate("/history")}
                        className="w-full bg-green-600 hover:bg-green-700 transition rounded-xl py-3 text-lg font-bold shadow-lg shadow-green-900/20"
                    >
                        View My Impact History
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black py-16 px-6 text-white">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fade-in">
                <button onClick={() => window.history.back()} className="mb-6 text-white/70 hover:text-white transition">← Back</button>

                <h1 className="text-3xl font-extrabold text-center mb-2">Secure Donation 🔒</h1>
                <p className="text-center text-gray-400 mb-8">Enter your details to proceed with the payment.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Amount & Purpose Section */}
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold mb-4 text-blue-300">1. Donation Details</h3>

                        <label className="block text-sm mb-2 text-gray-300">Amount (JD)</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                            {presetAmounts.map((value) => (
                                <div
                                    key={value}
                                    onClick={() => setAmount(value)}
                                    className={`py-2 rounded-lg text-center cursor-pointer border text-sm transition
                                    ${Number(amount) === value ? "bg-blue-600 border-blue-400" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                        <input
                            type="number"
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:border-blue-500 outline-none transition"
                            placeholder="Custom Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <label className="block text-sm mt-4 mb-2 text-gray-300">I want to support...</label>
                        <select
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:border-blue-500 outline-none appearance-none"
                            value={purpose || ""}
                            onChange={(e) => setPurpose(e.target.value)}
                        >
                            <option value="" disabled>Select a Cause</option>
                            {donationPurposes.map(p => <option key={p} value={p} className="text-black">{p}</option>)}
                        </select>
                    </div>

                    {/* Payment Section */}
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                            <span className="text-6xl">💳</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-4 text-emerald-300">2. Payment Method</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Card Number</label>
                                <input
                                    type="text"
                                    maxLength="19"
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:border-emerald-500 outline-none font-mono"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-300">Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:border-emerald-500 outline-none font-mono"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-300">CVV</label>
                                    <input
                                        type="password"
                                        maxLength="3"
                                        placeholder="123"
                                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:border-emerald-500 outline-none font-mono"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <NGOSelector
                        donationType="money"
                        selectedNgoId={selectedNgoId}
                        onChange={setSelectedNgoId}
                    />

                    {/* Agreement & Submit */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-blue-500"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                        />
                        <span className="text-sm text-gray-400">I confirm this donation is voluntary and non-refundable.</span>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {loading ? "Processing Payment..." : `Donate ${amount ? amount + " JD" : "Now"}`}
                    </button>

                </form>
            </div>
        </div>
    );
}
