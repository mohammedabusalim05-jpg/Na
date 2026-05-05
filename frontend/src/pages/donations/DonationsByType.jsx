import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function DonationsByType() {
    const { type } = useParams(); // نفس النوع من الرابط
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/api/donations/type/${type}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDonations(res.data);
            } catch (error) {
                console.error("Error loading donations:", error);
            }
            setLoading(false);
        };

        fetchDonations();
    }, [type]);


    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-xl">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Donations – {type.replace("-", " ").toUpperCase()}
            </h2>

            {donations.length === 0 ? (
                <p className="text-gray-600 text-lg">No donations found for this category.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((item) => (
                        <div
                            key={item.id}
                            className="p-5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>

                            <p className="text-gray-700 mt-2 line-clamp-3">
                                {item.description}
                            </p>

                            <p className="mt-3 text-sm text-gray-600">
                                <strong>Date:</strong>{" "}
                                {new Date(item.created_at).toLocaleDateString()}
                            </p>

                            <p className="mt-1 text-sm">
                                <strong>Status:</strong>{" "}
                                {item.is_completed ? (
                                    <span className="text-green-600 font-semibold">Completed</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Pending</span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
