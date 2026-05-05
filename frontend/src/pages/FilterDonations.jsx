import { useState } from "react";
import api from "../api/index";

export default function FilterDonations() {
    const [type, setType] = useState("");
    const [results, setResults] = useState([]);

    const handleFilter = () => {
        if (!type) return;

        api.get(`/donations/type/${type}/`) // ✅ المسار الصحيح
            .then((res) => setResults(res.data))
            .catch((err) => console.log(err));
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">Filter Donations</h1>

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="p-3 rounded-xl bg-white/10 border border-white/20"
            >
                <option value="">Select Category</option>
                <option value="blood">Blood Donation</option>
                <option value="organ">Organ Donation</option>
                <option value="money">Financial Donation</option>
                <option value="food">Food Donation</option>
                <option value="adahi">Adahi</option>
                <option value="clothes">Clothes Donation</option>
                <option value="furniture">Furniture</option>
                <option value="medical">Medical Equipment</option>
                <option value="household">Household Items</option>
                <option value="water">Clean Water</option>
                <option value="baby">Baby Supplies</option>
                <option value="toys">Toys</option>
                <option value="education">Education Support</option>
                <option value="electronics">Electronics</option>
                <option value="cleaning">Cleaning Supplies</option>
                <option value="medicine_support">Medicine Support</option>
                <option value="pets">Pet Support</option>
                <option value="volunteer">Volunteer Time</option>
                <option value="skills">Professional Help</option>
                <option value="families">Family Support</option>
                <option value="refugees">Refugee Support</option>
                <option value="orphans">Orphans Sponsorship</option>
                <option value="charity_general">General Charity</option>
                <option value="food_coupons">Food Coupons</option>
            </select>

            <button
                onClick={handleFilter}
                className="ml-4 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
            >
                Search
            </button>

            <div className="mt-6 space-y-4">
                {results.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white/10 p-4 rounded-xl border border-white/20"
                    >
                        <h2 className="text-xl font-bold">{item.title}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
