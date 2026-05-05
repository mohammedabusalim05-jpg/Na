import { useEffect, useState } from "react";
import api from "../../api";

export default function VolunteerReview() {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        api.get("/volunteers/admin/under-review/")
            .then(res => setApps(res.data))
            .catch(err => console.error(err));
    }, []);

    const refresh = () => {
        api.get("/volunteers/admin/under-review/")
            .then(res => setApps(res.data));
    };

    const approve = (id) => {
        api.post(`/volunteers/${id}/approve/`)
            .then(() => refresh());
    };

    const reject = (id) => {
        api.post(`/volunteers/${id}/reject/`)
            .then(() => refresh());
    };

    return (
        <div style={{ padding: 24 }}>
            <h2>Volunteer Applications</h2>

            {apps.length === 0 && <p>No applications under review</p>}

            {apps.map(a => (
                <div key={a.id} style={{ marginBottom: 12 }}>
                    <b>{a.volunteer}</b> — {a.campaign}
                    <div>
                        <button onClick={() => approve(a.id)}>Approve</button>
                        <button onClick={() => reject(a.id)}>Reject</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
