import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all auth tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");

        // Success notification
        toast.success("Logged out successfully");

        // Redirect to login
        navigate("/login");
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
            <p className="text-xl animate-pulse">Logging out...</p>
        </div>
    );
};

export default Logout;
