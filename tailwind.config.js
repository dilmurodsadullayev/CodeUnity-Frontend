/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./public/index.html",

        "./src/**/*.{js,jsx,ts,tsx}",
    ],

    darkMode: "class",

    theme: {
        extend: {

            // =====================================================
            // FONT FAMILY
            // =====================================================

            fontFamily: {
                sans: [
                    "Space Grotesk Variable",
                    "Space Grotesk",
                    "sans-serif",
                ],

                mono: [
                    "JetBrains Mono Variable",
                    "JetBrains Mono",
                    "monospace",
                ],
            },


            // =====================================================
            // COLORS
            // =====================================================

            colors: {

                society: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    200: "#c7d2fe",
                    300: "#a5b4fc",
                    400: "#818cf8",
                    500: "#6366f1",
                    600: "#4f46e5",
                    700: "#4338ca",
                    800: "#3730a3",
                    900: "#312e81",
                    950: "#1e1b4b",
                },


                cyber: {
                    bg: "#0d1117",

                    surface: "#161b22",

                    elevated: "#1c2128",

                    border: "#30363d",

                    borderLight: "#3d444d",

                    text: "#f0f6fc",

                    muted: "#8b949e",

                    subtle: "#6e7681",
                },


                accent: {
                    indigo: "#6366f1",

                    purple: "#8b5cf6",

                    cyan: "#22d3ee",

                    emerald: "#22c55e",

                    amber: "#f59e0b",

                    danger: "#ef4444",
                },
            },


            // =====================================================
            // BACKGROUND
            // =====================================================

            backgroundImage: {

                "society-gradient":
                    "linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #8b5cf6 100%)",

                "society-gradient-soft":
                    "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(139,92,246,0.10))",

                "cyber-radial":
                    "radial-gradient(circle at top, rgba(99,102,241,0.13), transparent 45%)",

                "cyber-radial-purple":
                    "radial-gradient(circle at center, rgba(139,92,246,0.10), transparent 55%)",
            },


            // =====================================================
            // SHADOW
            // =====================================================

            boxShadow: {

                "society":
                    "0 15px 40px rgba(79, 70, 229, 0.18)",

                "society-lg":
                    "0 25px 70px rgba(79, 70, 229, 0.25)",

                "purple-glow":
                    "0 0 35px rgba(139, 92, 246, 0.20)",

                "cyan-glow":
                    "0 0 35px rgba(34, 211, 238, 0.15)",

                "dark-card":
                    "0 25px 70px rgba(0, 0, 0, 0.38)",
            },


            // =====================================================
            // BORDER RADIUS
            // =====================================================

            borderRadius: {

                "society":
                    "14px",

                "society-lg":
                    "20px",

                "society-xl":
                    "26px",
            },


            // =====================================================
            // ANIMATION
            // =====================================================

            animation: {

                "fade-in":
                    "fadeIn 0.45s ease-out forwards",

                "fade-up":
                    "fadeUp 0.5s ease-out forwards",

                "spin-slow":
                    "spin 3s linear infinite",

                "pulse-glow":
                    "pulseGlow 2.5s ease-in-out infinite",

                "float":
                    "float 5s ease-in-out infinite",
            },


            // =====================================================
            // KEYFRAMES
            // =====================================================

            keyframes: {

                fadeIn: {

                    "0%": {
                        opacity: "0",
                    },

                    "100%": {
                        opacity: "1",
                    },
                },


                fadeUp: {

                    "0%": {
                        opacity: "0",

                        transform:
                            "translateY(14px)",
                    },

                    "100%": {
                        opacity: "1",

                        transform:
                            "translateY(0)",
                    },
                },


                pulseGlow: {

                    "0%, 100%": {
                        opacity: "0.55",

                        transform:
                            "scale(1)",
                    },

                    "50%": {
                        opacity: "1",

                        transform:
                            "scale(1.04)",
                    },
                },


                float: {

                    "0%, 100%": {
                        transform:
                            "translateY(0)",
                    },

                    "50%": {
                        transform:
                            "translateY(-8px)",
                    },
                },
            },


            // =====================================================
            // LETTER SPACING
            // =====================================================

            letterSpacing: {

                cyber:
                    "0.08em",

                widerCyber:
                    "0.14em",
            },


            // =====================================================
            // TRANSITION
            // =====================================================

            transitionDuration: {

                250:
                    "250ms",
            },


            // =====================================================
            // MAX WIDTH
            // =====================================================

            maxWidth: {

                society:
                    "1440px",
            },
        },
    },

    plugins: [],
};