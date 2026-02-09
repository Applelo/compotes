# AGENTS.md

> This document provides context for AI agents and developers working with the Compotes codebase.

## Project Overview

**Compotes** is a component library focused on **customization** and **accessibility**. It provides headless/minimal-CSS components that developers can easily style to match their design systems.

- 📦 **NPM Package**: [`compotes`](https://www.npmjs.com/package/compotes)
- 📖 **Documentation**: [compotes.dev](https://compotes.dev)
- 🔗 **Repository**: [github.com/Applelo/compotes](https://github.com/Applelo/compotes)
- 📄 **License**: MIT

### Key Features

- 👨‍🎨 **Minimal CSS** — Components come with minimal styling, giving you full control over customization
- 🦾 **Accessibility** — Built with accessibility in mind (ARIA attributes, keyboard navigation)
- 📠 **Fully Typed** — Complete TypeScript support with exported type definitions
- 🎯 **Framework Agnostic** — Core library works with vanilla JS/TS, with Vue 3 wrapper available

---

## Repository Structure

This is a **pnpm monorepo** with the following structure:

```
compotes/
├── packages/
│   ├── core/          # Core vanilla JS/TS library (published as `compotes`)
│   │   ├── src/
│   │   │   ├── components/   # Component implementations
│   │   │   ├── css/          # Component CSS files
│   │   │   └── utils/        # Shared utilities
│   │   ├── test/             # Vitest tests
│   │   └── dist/             # Build output (JS, UMD, types, CSS)
│   │
│   └── vue/           # Vue 3 wrapper (published as `@compotes/vue`)
│       ├── src/
│       │   ├── components/   # Vue components (.vue files)
│       │   └── composables/  # Vue composables for each component
│       ├── test/             # Vitest tests
│       └── demo/             # Vue demo files
│
├── docs/              # VitePress documentation site
│   ├── guide/         # Component guides (Markdown)
│   └── demo/          # Interactive demos (HTML)
│
└── .github/workflows/ # CI configuration
```

---

## Available Components

| Component | Description | Core Class | Vue Components |
|-----------|-------------|------------|----------------|
| **Collapse/Accordion** | Expandable/collapsible content sections | `Collapse` | `CCollapse`, `CCollapseTrigger` |
| **Drag** | Draggable elements with touch support | `Drag` | `CDrag` |
| **Drilldown** | Nested navigation menus | `Drilldown` | `CDrilldown`, `CDrilldownMenu`, `CDrilldownBack`, `CDrilldownNext` |
| **Dropdown** | Accessible dropdown menus | `Dropdown` | `CDropdown`, `CDropdownTrigger`, `CDropdownMenu` |
| **Marquee** | Scrolling content (like a news ticker) | `Marquee` | `CMarquee` |

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | `>= 20` |
| pnpm | `10.29.1` (see `package.json` for exact version) |

---

## Development Commands

### Root Level Commands

Run these from the repository root:

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm test` | Run type-checking + Vitest tests |
| `pnpm test:vitest` | Run only Vitest tests |
| `pnpm test:types` | Run only type-checking |
| `pnpm docs` | Start VitePress dev server |
| `pnpm docs:build` | Build documentation site |
| `pnpm docs:serve` | Preview built documentation |

### Package-Specific Commands

#### Core Package (`packages/core`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Watch mode for development |
| `pnpm build` | Build the package |
| `pnpm test:vitest` | Run Vitest tests |
| `pnpm test:types` | Run type-checking |
| `pnpm test:browser` | Run browser-based tests |

#### Vue Package (`packages/vue`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Watch mode for development |
| `pnpm build` | Build the package |
| `pnpm test:vitest` | Run Vitest tests |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |

---

## Build & Tooling

| Tool | Purpose |
|------|---------|
| **tsdown** | Build tool for both core and Vue packages |
| **Vitest** | Unit and browser testing |
| **TypeScript** + **vue-tsc** | Type-checking |
| **VitePress** | Documentation site generator |
| **LightningCSS** | CSS processing for core package |
| **ESLint** | Code linting (using `@antfu/eslint-config`) |
| **Playwright** | Browser automation for tests |

---

## pnpm Catalog

This project uses **pnpm catalogs** to centralize dependency versions across the monorepo. The catalog is defined in `pnpm-workspace.yaml`.

### Configuration

```yaml
catalogMode: strict   # All shared dependencies MUST use catalog versions
```

The `strict` mode ensures that any dependency listed in the catalog **must** use `catalog:` in package.json files, preventing version drift across packages.

### How It Works

Instead of specifying versions in each `package.json`:

```json
// ❌ Without catalog
{
  "devDependencies": {
    "typescript": "^5.9.3",
    "vitest": "^4.0.18"
  }
}
```

Dependencies reference the catalog:

```json
// ✅ With catalog
{
  "devDependencies": {
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

### Catalog Dependencies

Dependencies are managed via the catalog (defined in `pnpm-workspace.yaml`).

### Updating Dependencies

To update a catalog dependency:

1. Edit the version in `pnpm-workspace.yaml` under the `catalog:` section
2. Run `pnpm install` to update the lockfile
3. All packages using `catalog:` will automatically use the new version

### Additional Workspace Settings

```yaml
shellEmulator: true           # Use shell emulator for scripts
trustPolicy: no-downgrade     # Prevent dependency downgrades
onlyBuiltDependencies:
  - esbuild                   # Only allow esbuild as a built dependency
```

---

## Package Exports

### Core Package (`compotes`)

```javascript
// JavaScript/TypeScript
import { Collapse, Drag, Drilldown, Dropdown, Marquee } from 'compotes'

// CSS (all components)
import 'compotes/css'

// CSS (individual components)
import 'compotes/css/collapse'
import 'compotes/css/drag'
import 'compotes/css/drilldown'
import 'compotes/css/dropdown'
import 'compotes/css/marquee'
```

### Vue Package (`@compotes/vue`)

```javascript
import { 
  CCollapse, CCollapseTrigger,
  CDrag,
  CDrilldown, CDrilldownMenu, CDrilldownBack, CDrilldownNext,
  CDropdown, CDropdownTrigger, CDropdownMenu,
  CMarquee
} from '@compotes/vue'

// Composables
import { 
  useCollapse, useDrag, useDrilldown, useDropdown, useMarquee 
} from '@compotes/vue'
```

---

## Architecture Notes

### Core Package

- **Parent Class**: All components extend from a shared `_parent.ts` base class
- **Event System**: Components emit custom events for lifecycle and interactions
- **CSS Strategy**: Minimal CSS that handles only essential styling (visibility, transitions)
- **Accessibility**: Components implement ARIA attributes and keyboard navigation

### Vue Package

- **Wrapper Pattern**: Vue components wrap the core library classes
- **Composables**: Each component has a corresponding composable (`useCollapse`, etc.)
- **Context API**: Components use Vue's provide/inject for parent-child communication
- **Template Refs**: Components expose the underlying core instance via refs

---

## Testing

- Tests are located in `packages/*/test/` directories
- Uses **Vitest** for unit tests
- Uses **Playwright** for browser tests
- Type-checking via `tsc` (core) and `vue-tsc` (Vue package)

To run all tests:
```bash
pnpm test
```

---

## Contributing Guidelines

1. **Code Style**: Follow the ESLint configuration (`@antfu/eslint-config`)
2. **Type Safety**: Ensure all code is properly typed
3. **Accessibility**: Maintain WCAG compliance for all components
4. **Testing**: Add tests for new features and bug fixes
5. **Documentation**: Update docs in `/docs/guide/` for any component changes

---

## Common Development Workflows

### Adding a New Component

1. Create component class in `packages/core/src/components/`
2. Create CSS in `packages/core/src/css/`
3. Export from `packages/core/src/index.ts`
4. Add Vue wrapper in `packages/vue/src/components/`
5. Create composable in `packages/vue/src/composables/`
6. Export from `packages/vue/src/index.ts`
7. Add documentation in `docs/guide/`
8. Add demo in `docs/demo/`

### Debugging a Component

1. Start the docs dev server: `pnpm docs`
2. Navigate to the component demo page
3. Check browser console for errors
4. Use the component's events for debugging

---

## Additional Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [tsdown Documentation](https://github.com/nicepkg/tsdown)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
