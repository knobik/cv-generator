import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      // Add em-based font size utilities
      matchUtilities(
        {
          'em-text': (value) => {
            // fontSize values can be strings or arrays like ["1rem", { lineHeight: "1.5" }]
            const size = Array.isArray(value) ? value[0] : value;
            return {
              fontSize: size.replace('rem', 'em'),
            };
          },
        },
        { values: theme('fontSize') }
      );
    }),
  ],
};
export default config;
