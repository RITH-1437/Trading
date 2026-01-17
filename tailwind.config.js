/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0a0e1a",
          card: "#151b2e",
          border: "#1e2739",
          text: "#e5e7eb",
        },
        profit: "#10b981",
        loss: "#ef4444",
        warning: "#f59e0b",
      },
    },
  },
  plugins: [],
};
