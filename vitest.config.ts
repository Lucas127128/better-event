import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'vmForks',
    clearMocks: true,
    experimental: { fsModuleCache: true },
    sequence: { concurrent: true },
    typecheck: { enabled: true, include: ['**/*.test.ts'] },
    coverage: {
      provider: 'istanbul',
    },
    detectAsyncLeaks: true,
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
