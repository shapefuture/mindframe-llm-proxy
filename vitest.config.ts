import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      all: true,
      include: ['src/**/*.{ts,tsx,js,jsx}', 'extension/src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        '**/*.d.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/tests/**',
        '**/test/**',
        '**/*.test-utils.{ts,tsx,js,jsx}',
        '**/*.stories.{ts,tsx,js,jsx}',
      ]
    }
  }
});