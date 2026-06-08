import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc', 'import'],
  rules: { 'no-var': 'error', 'typescript/await-thenable': 'error', 'import/no-cycle': 'error' },
  env: {
    builtin: true,
  },
});
