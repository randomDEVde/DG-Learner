/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#09111d",
          900: "#102033",
          800: "#16314c",
        },
        sand: "#e7dcc6",
        brass: "#c4a45d",
        signal: "#56c0ac",
        alert: "#f07f5a",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(4, 10, 20, 0.35)",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
