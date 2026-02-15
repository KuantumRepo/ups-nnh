import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                ups: {
                    yellow: "#FFC400",
                    brown: "#351C15",
                    gold: "#FADA5E",
                    black: "#000000"
                }
            },
        },
    },
    plugins: [],
};
export default config;
