import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: {
    tsgo: true,
  },
  exports: true,
  minify: true,
  platform: 'neutral',
  publint: true,
  attw: {
    profile: 'esm-only',
  },
});
