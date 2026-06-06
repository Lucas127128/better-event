import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc'],
  rules: {},
  env: {
    builtin: true,
  },
});
