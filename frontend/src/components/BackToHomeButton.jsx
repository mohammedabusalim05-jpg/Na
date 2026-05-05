import { Link, useLocation } from "react-router-dom";

export default function BackToHomeButton() {
    const location = useLocation();

    // Show Home button only on the donations/categories page
    if (location.pathname !== "/categorization") {
        return null;
    }

    return (
        <Link
            to="/"
            className="
                absolute left-28 top-6 z-50
                text-white/70 hover:text-white
                transition
                hidden md:block
            "
        >
            🏠 Home
        </Link>
    );
}