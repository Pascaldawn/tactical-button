/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
	foreground: '#111827',
        border: '#E5E7EB', // light gray border
        muted: '#f3f4f6',
	primary: '#3b82f6', // blue-500
        "primary-foreground": '#ffffff',
	secondary: "#e5e7eb", // light gray
        "secondary-foreground": "#1f2937", // dark gray
	      // add more if needed
      },
    },
  },
  plugins: [],
}

