import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc'],
  rules: { 'no-var': 'error' },
  env: {
    builtin: true,
  },
});
