/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1d4ed8",
          secondary: "#0f766e",
          accent: "#0ea5e9",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
          neutral: "#334155",
          ink: "#0f172a",
          paper: "#f8fbff"
        },
        academic: {
          navy: "#1d4ed8",
          navydark: "#111827",
          navydeep: "#06111f",
          gold: "#0f766e",
          goldhover: "#115e59",
          goldlight: "#5eead4",
          cream: "#f8fafc"
        }
      },
      fontFamily: {
        serif: ["Cinzel", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.7s ease-out forwards",
        "slide-in-right": "slideInRight 0.7s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "gradient-x": "gradientX 6s ease infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.35)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      },
      backdropBlur: {
        xs: "2px"
      },
      boxShadow: {
        "glow-gold": "0 0 30px rgba(212, 175, 55, 0.2)",
        "glow-gold-lg": "0 0 60px rgba(212, 175, 55, 0.3)",
        "inner-gold": "inset 0 0 30px rgba(212, 175, 55, 0.05)"
      }
    },
  },
  plugins: [],
}
