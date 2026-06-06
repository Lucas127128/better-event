import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // pool: 'threads',
    clearMocks: true,
    experimental: { fsModuleCache: true },
    sequence: { concurrent: true },
    typecheck: { enabled: true },
    coverage: {
      provider: 'istanbul',
    },
    detectAsyncLeaks: true,
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
