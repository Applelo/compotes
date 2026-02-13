# CLAUDE.md / AGENTS.md

This file provides guidance when working with code in this repository.

## Project Overview

Compotes is a component library focused on customization and accessibility. It provides framework-agnostic UI components (collapse, drag, drilldown, dropdown, marquee) with minimal CSS to allow maximum customization.

## Monorepo Structure

This is a pnpm workspace monorepo with catalog mode enabled (`catalogMode: strict`):

- **packages/core** (`compotes`): Vanilla JavaScript/TypeScript components (class-based)
- **packages/vue** (`@compotes/vue`): Vue 3 wrapper components
- **docs/**: VitePress documentation site

Dependencies are managed via pnpm catalog in `pnpm-workspace.yaml`. Use `catalog:` in package.json to reference catalog versions.

## Common Commands

### Building
```bash
pnpm build                 # Build all packages
pnpm -F compotes build     # Build core package only
pnpm -F @compotes/vue build # Build Vue package only
```

### Testing
```bash
pnpm test                  # Run all tests (types + vitest)
pnpm test:vitest           # Run vitest tests across all packages
pnpm test:types            # Run type checks only
pnpm -F compotes test:vitest # Run tests for core package only
```

Tests use Vitest with browser testing via Playwright. Browser tests run against Chromium, Firefox, and WebKit.

### Linting
```bash
pnpm lint                  # Lint all files
pnpm lint:fix              # Lint and auto-fix
```

Uses `@antfu/eslint-config`.

### Documentation
```bash
pnpm docs                  # Start VitePress dev server
pnpm docs:build            # Build documentation
pnpm docs:serve            # Preview built docs
```

## Architecture

### Core Package (packages/core)

Components follow a class-based architecture:

1. **Parent Base Class** (`src/components/_parent.ts`):
   - All components extend `Parent<E, O>` abstract class
   - Provides lifecycle methods: `init()`, `destroy()`
   - Event system using custom events with naming pattern: `c.{componentName}.{eventName}`
   - Event cleanup via AbortController
   - `registerEvent()` for automatic cleanup on destroy
   - Error handling via custom ErrorCompotes class
   - Options interface with `init` and `on` event listeners

2. **Component Pattern**:
   - Constructor accepts element (selector or HTMLElement) and options
   - `initElements()`: Query and store DOM element references
   - `initEvents()`: Register event listeners using `registerEvent()`
   - `initAccessibilityAttrs()`: Set ARIA attributes for accessibility
   - Public methods for component actions (show, hide, toggle, etc.)
   - Protected `emitEvent()` for custom events

3. **CSS Architecture**:
   - Components use BEM-like naming: `c-{component}`, `c-{component}--{modifier}`
   - Trigger/action elements: `c-{component}-{action}` (e.g., `c-collapse-trigger`)
   - Individual CSS files per component in `src/css/`
   - CSS can be imported separately: `compotes/css/{component}.css`

4. **Build Configuration**:
   - Uses tsdown with custom plugin to emit individual CSS files
   - Outputs ESM and UMD formats
   - LightningCSS for CSS minification
   - Global name: `compotes` (for UMD)

### Vue Package (packages/vue)

Vue components wrap core components using a composable pattern:

1. **Component Structure**:
   - Each Vue component (e.g., `CCollapse.vue`) is a thin wrapper
   - Uses corresponding composable (e.g., `useCollapse()`)
   - Provides Vue-friendly API: props, emits, expose
   - Supports `as` prop for custom element rendering
   - Auto-generates stable IDs for accessibility

2. **Composables** (`src/composables/`):
   - All composables extend `useParent()` base composable
   - Create and manage core component instances
   - Return reactive state + action methods
   - Sync Vue reactive state with core component state via event listeners
   - Use `markRaw()` for component instances to avoid reactivity overhead
   - Use `shallowReactive()` for state to minimize reactivity

3. **Context System**:
   - Uses Vue's provide/inject for component communication
   - Context keys defined in `src/components/context.ts`
   - Example: Collapse trigger components inject collapse ID from parent

## Development Guidelines

### Adding a New Component

1. **Core package**:
   - Create component class extending `Parent` in `src/components/{name}.ts`
   - Define Events enum and ComponentOptions interface
   - Add CSS file in `src/css/{name}.css`
   - Export from `src/index.ts`
   - Add CSS export to `package.json` exports field

2. **Vue package**:
   - Create composable in `src/composables/{name}.ts` extending `useParent()`
   - Create component(s) in `src/components/C{Name}.vue`
   - Add context key if needed in `src/components/context.ts`
   - Export from `src/index.ts`

### Event Naming Convention

Custom events follow the pattern: `c.{componentName}.{eventName}`

Example: `c.collapse.show`, `c.collapse.hidden`, `c.drilldown.next`

Declare global event types:
```typescript
declare global {
  interface HTMLElementEventMap extends Record<`c.component.${Events}`, CustomEvent<Component>> {}
}
```

### Accessibility Patterns

- Use `initAccessibilityAttrs()` to set ARIA attributes
- Common attributes: `aria-controls`, `aria-expanded`, `role="button"`
- Use `tabbable` package for focus management
- Utility functions in `src/utils/accessibility.ts` (focusFirst, focusLast, focusSibling, etc.)

### Animation Handling

- Use `getTransitionDuration()` from `src/utils/animation.ts` to respect CSS transitions
- Set collapsing/transitioning states during animations
- Clean up with `clearTimeout()` before new animations

## Important Notes

- Node.js >= 20 required
- pnpm is the package manager (use pnpm, not npm or yarn)
- Vue package has peer dependency on Vue >= 3.0.0
- Core components work in any JavaScript environment (no framework required)
- CSS is intentionally minimal for customization
