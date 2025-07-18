module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				background: '#fff9c7',
  				foreground: 'hsl(var(--primary-foreground))',
  				yellow: '#f6d110',
  				dark: '#62470e',
  				DEFAULT: 'hsl(var(--primary))'
  			},
  			secondary: {
  				background: '#ffffff',
  				foreground: 'hsl(var(--secondary-foreground))',
  				light: '#f7f7f7',
  				dark: '#222222',
  				DEFAULT: 'hsl(var(--secondary))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  				light: '#746b6b',
  				dark: '#792f0f'
  			},
  			border: 'hsl(var(--border))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			'dm-serif': [
  				'DM Serif Display',
  				'serif'
  			],
  			alata: [
  				'Alata',
  				'sans-serif'
  			],
  			'dm-sans': [
  				'DM Sans',
  				'sans-serif'
  			],
  			joan: [
  				'Joan',
  				'serif'
  			],
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			antic: [
  				'Antic',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			custom: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};