import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc'],
  rules: { 'no-var': 'error', 'typescript/await-thenable': 'error' },
  env: {
    builtin: true,
  },
});
