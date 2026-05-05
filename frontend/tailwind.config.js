/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // ✅ هذا هو المفتاح
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            backdropBlur: {
                xs: "2px",
            },
            colors: {
                glass: "rgba(255, 255, 255, 0.20)",
            },
        },
    },
    plugins: [],
};
