// tailwind.config.ts
import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  purge: {
    enabled: process.env.PROD,
    safeList: [],
    content: [
      './index.html',
      './src/**/*.tsx',
      './src/**/*.ts',
      './src/**/*.vue',
    ],
  },
  theme: {
    extend: {
      fontWeight: ['hover', 'focus'],
    },
  },
  variants: {},
});
