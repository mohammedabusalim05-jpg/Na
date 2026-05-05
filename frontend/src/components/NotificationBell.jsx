import { useEffect, useState } from "react";
import api from "../api";

export default function NotificationBell({ setRefresh }) {
    const [count, setCount] = useState(0);

    const fetchUnreadCount = () => {
        api.get("/notifications/unread-count/")
            .then(res => setCount(res.data.unread))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUnreadCount();

        if (setRefresh) {
            setRefresh(() => fetchUnreadCount);
        }
    }, []);

    return (
        <div style={{ position: "relative", cursor: "pointer" }}>
            🔔
            {count > 0 && (
                <span style={{
                    position: "absolute",
                    top: -6,
                    right: -10,
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: 12
                }}>
                    {count}
                </span>
            )}
        </div>
    );
}
