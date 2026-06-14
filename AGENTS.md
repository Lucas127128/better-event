# better-event — AGENTS.md

Single-module isomorphic type-safe event emitter. Source in `src/index.ts`, tests in `tests/index.test.ts`.

## Commands (all use `bunx -b`)

| Action       | Command                                                              |
| ------------ | -------------------------------------------------------------------- |
| Install      | `bun install`                                                        |
| Build        | `bun run build` (→ `bunx -b tsdown`)                                 |
| Test         | `bun run test:agent` (→ `AI_AGENT=opencode bunx -b vitest -w false`) |
| Lint         | `bun run lint` (→ `bunx -b oxlint --type-aware`)                     |
| Format       | `bun run fmt` (→ `bunx -b oxfmt`)                                    |
| Format check | `bun fmt --check`                                                    |
| Release      | `bun run release` (→ `bumpp`)                                        |

## Toolchain quirks

- **Package manager**: Bun (must use `bun install`, not npm/pnpm). CI pins bun `1.3.14`.
- **Linter**: `oxlint` (not ESLint). Config in `oxlint.config.ts`. Plugins: `typescript`, `unicorn`, `oxc`.
- **Formatter**: `oxfmt` (not Prettier). Config in `.oxfmtrc.json` with `singleQuote: true`.
- **Builder**: `tsdown` (not tsup/rollup directly). Config in `tsdown.config.ts`. Produces minified ESM with `.d.ts` via `tsgo` (TypeScript native preview). `publint` and `attw` (`esm-only` profile) run as part of the build.
- **Test runner**: Vitest with `vmForks` pool, concurrent execution (`sequence.concurrent: true`), typechecking enabled, `detectAsyncLeaks: true`, Istanbul coverage.
- **tsconfig**: `verbatimModuleSyntax` — use `import type` for type-only imports.
- **Module**: ESM only (`"type": "module"` in package.json). No CJS build.
- **Distributed files**: only `dist/` (listed in `package.json` `files`).
- **Release**: `bumpp` does version bump + git tag. Publishing is CI-only via GitHub Release → `npm publish --provenance`.

## Key structure

- Single public API: `createEventEmitter` from `src/index.ts`
- Types exported: use `EventEmitter<T>` type helper
- All handlers are `(data: T) => Promise<void>`
- Handlers registered at init time only (config-driven, no `on()`/`addListener()` after creation)
- `AbortSignal` support via optional `signal` property on each event config
