/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#2f3034",
          900: "#4b4c52",
          800: "#6f7076",
        },
        sand: "#f7f7f8",
        brass: "#ff1208",
        signal: "#a4a4a8",
        alert: "#ff1208",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(60, 60, 63, 0.2)",
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "sans-serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
