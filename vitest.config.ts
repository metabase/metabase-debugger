import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import magicalSvg from 'vite-plugin-magical-svg'

export default defineConfig({
  plugins: [
    react(),
    magicalSvg({
      target: 'react',
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'next.config.mjs',
        'next-env.d.ts',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'vitest.config.ts',
        'src/utils/**',
        '.next/**',
        'src/app/**',
        'coverage/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
