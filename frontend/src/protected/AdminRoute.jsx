import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("access");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    // غير مسجل دخول
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // مسجل دخول لكن ليس Admin
    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
