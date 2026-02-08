# AGENTS

## Project Summary
Compotes is a component library focused on customization and accessibility. This repo is a pnpm monorepo with a core vanilla JS/TS package and a Vue package, plus VitePress docs and demos.

## Repo Structure
- `packages/core` — core library published as `compotes`
- `packages/vue` — Vue 3 wrapper published as `@compotes/vue`
- `docs` — VitePress docs and demos
- `docs/guide` — component guides (collapse, drag, drilldown, dropdown, marquee)

## Requirements
- Node.js `>= 20`
- pnpm `10.28.2`

## Tooling
- Build tool: `tsdown` (used by both core and Vue packages)
- Tests: `vitest` plus type-checking via `tsc` and `vue-tsc`
- Docs: `vitepress`
- CSS pipeline: `lightningcss` (core package)

## Common Commands (from root)
- Install deps: `pnpm install`
- Build all packages: `pnpm build`
- Lint: `pnpm lint`
- Fix lint: `pnpm lint:fix`
- Tests (types + vitest): `pnpm test`
- Docs dev server: `pnpm docs`
- Docs build: `pnpm docs:build`
- Docs preview: `pnpm docs:serve`

## Package-Specific Commands
- Core dev/build (from `packages/core`): `pnpm dev`, `pnpm build`
- Core tests: `pnpm test:vitest`, `pnpm test:types`, `pnpm test:browser`
- Vue dev/build (from `packages/vue`): `pnpm dev`, `pnpm build`

## Notes
- The core package exports JS, UMD, types, and component CSS from `packages/core/dist`.
- Workspace scripts use `pnpm -r` to run across packages.
