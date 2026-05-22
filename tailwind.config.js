/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        echo: {
          warm: "#FFB07A",
          cool: "#7AB8FF",
          frozen: "#A8C4D9",
          paper: "#FAF7F2",
          ink: "#2A2A2A",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
    },
  },
  plugins: [],
};
