import { useEffect, useState } from "react";
import api from "../api";

export default function Notifications({ refreshUnread }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        api.get("/notifications/my/")
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read/`);

            setItems(prev =>
                prev.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                )
            );

            if (refreshUnread) refreshUnread();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h4>Notifications</h4>

            {items.length === 0 && <p>No notifications</p>}

            {items.map(n => (
                <div
                    key={n.id}
                    onClick={() => !n.is_read && markAsRead(n.id)}
                    style={{
                        cursor: "pointer",
                        fontWeight: n.is_read ? "normal" : "bold",
                        marginBottom: 8,
                        padding: 8,
                        background: "#f5f5f5",
                        borderRadius: 6
                    }}
                >
                    {n.message}
                </div>
            ))}
        </div>
    );
}
