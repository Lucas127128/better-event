import { defineConfig } from 'tsdown';
import { StaleGuardRecorder } from 'tsdown-stale-guard';

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
  plugins: [StaleGuardRecorder()],
});
