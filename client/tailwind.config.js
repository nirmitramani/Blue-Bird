/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    
    extend: {
      fontFamily: {
        palanquin: ["Palanquin", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        sans: ['Inter'],
        
      },
      colors: {
        primary: "#ECEEFF",
        "navy-blue": "#4361ee",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)",
        'primary-white': '#F2F2F2',
        'primary-light': '#4B83F2',
        'primary-black': '#0D0D0D',
        "light-white": "rgba(255,255,255,0.17)",
      },
      boxShadow: {
        "3xl": "0 10px 40px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        hero: "url('assets/images/collection-background.svg')",
        card: "url('assets/images/thumbnail-background.svg')",
      },  
      // screens: {
      //   xs: "480px",
      //   ss: "620px",
      //   sm: "768px",
      //   md: "1060px",
      //   lg: "1200px",
      //   xl: "1700px",
      // },
      extend: {
      transitionProperty: {
        'spacing': 'margin, padding',
      }
    }
    },
  },
  plugins: [],
}

