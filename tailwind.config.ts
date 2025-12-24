import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Custom colors untuk branding SMB
                primary: {
                    50: '#fef7ee',
                    100: '#fcecd6',
                    200: '#f8d5ac',
                    300: '#f3b778',
                    400: '#ed8f42',
                    500: '#e8711e',
                    600: '#d95714',
                    700: '#b44013',
                    800: '#903418',
                    900: '#752c16',
                    950: '#3f140a',
                },
                secondary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
