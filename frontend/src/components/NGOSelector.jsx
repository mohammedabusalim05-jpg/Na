import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getNgosByDonationCategoryApi } from "../api";

export default function NGOSelector({ donationType, selectedNgoId, onChange }) {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        onChange("");
        setSearchQuery("");

        const loadNgos = async () => {
            try {
                setLoading(true);
                const response = await getNgosByDonationCategoryApi(donationType);
                setNgos(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Failed to load NGOs:", error);
                toast.error("Failed to load NGOs for this category.");
            } finally {
                setLoading(false);
            }
        };

        if (donationType) {
            loadNgos();
        } else {
            setNgos([]);
            setLoading(false);
        }
    }, [donationType, onChange]);

    const filteredNgos = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return ngos;

        return ngos.filter((ngo) =>
            [
                ngo.display_name,
                ngo.ngo_name,
                ngo.ngo_email,
                ngo.description,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
        );
    }, [ngos, searchQuery]);

    const getNgoName = (ngo) =>
        ngo.display_name || ngo.ngo_name || ngo.ngo_email || "Nakhwa partner NGO";

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <label className="block text-lg font-semibold text-white">
                Choose NGO / Organization
            </label>

            <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search NGO by name or email..."
                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-emerald-400"
            />

            {loading ? (
                <p className="mt-4 text-sm text-gray-300">Loading NGOs...</p>
            ) : ngos.length === 0 ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-gray-300">
                    No NGOs are linked to this category yet.
                </div>
            ) : filteredNgos.length === 0 ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-gray-300">
                    No NGOs match your search.
                </div>
            ) : (
                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                    {filteredNgos.map((ngo) => {
                        const selected = Number(selectedNgoId) === Number(ngo.ngo_id);

                        return (
                            <button
                                key={ngo.id}
                                type="button"
                                onClick={() => onChange(ngo.ngo_id)}
                                className={`w-full rounded-xl border p-4 text-left transition ${
                                    selected
                                        ? "border-emerald-400 bg-emerald-500/15"
                                        : "border-white/10 bg-slate-950/60 hover:border-emerald-400/50"
                                }`}
                            >
                                <p className="font-bold text-white">{getNgoName(ngo)}</p>
                                <p className="mt-1 text-sm text-gray-300">
                                    {ngo.ngo_email || "Email not available"}
                                </p>
                                {ngo.description && (
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        {ngo.description}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
