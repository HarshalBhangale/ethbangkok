const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
		animation: {
			'spin-slow': 'spin 10s linear infinite',
			'pulse-slow': 'pulse 5s infinite',
			'float': 'float 4s ease-in-out infinite',
			'flicker': 'flicker 2s infinite alternate',
		  },
		  keyframes: {
			float: {
			  '0%, 100%': { transform: 'translateY(0)' },
			  '50%': { transform: 'translateY(-10px)' },
			},
			flicker: {
			  '0%, 100%': { opacity: '1' },
			  '50%': { opacity: '0.8' },
			},
		  },
  		fontFamily: {
  			sans: ['Adelle Sans', ...defaultTheme.fontFamily.sans],
  			luckiest: ['Luckiest Guy"', 'cursive']
  		},
  		colors: {
  			'privy-navy': '#160B45',
  			'privy-light-blue': '#EFF1FD',
  			'privy-blueish': '#D4D9FC',
  			'privy-pink': '#FF8271'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require('@tailwindcss/forms'), require("tailwindcss-animate")],
};

