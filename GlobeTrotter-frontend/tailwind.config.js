/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"]
      },
      colors: {
        ink: "#17201d",
        mint: "#2F7D68",
        cream: "#F7F5EF",
        sand: "#E9E5D9"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23,32,29,.08)",
        card: "0 8px 30px rgba(23,32,29,.06)"
      }
    }
  },
  plugins: []
};
