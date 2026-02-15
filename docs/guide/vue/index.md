# Vue

`@compotes/vue` provides [composables](/guide/vue/composables) and component wrappers for the `compotes` library.

::: warning
This module is still in active development. Breaking changes can happen between versions.
:::

## Installation

Install the Vue version of the library with your favorite package manager.

::: info
No need to install the `compotes` package since it is a dependency of `@compotes/vue`.
:::

::: code-group

```sh [pnpm]
$ pnpm add -D @compotes/vue
```

```sh [npm]
$ npm add -D @compotes/vue
```

```sh [yarn]
$ yarn add -D @compotes/vue
```

```sh [bun]
$ bun add -D @compotes/vue
```

:::

## Components vs Composables

The Vue package offers two approaches to use Compote:

- **[Components](/guide/vue/components)** — Ready-to-use Vue components with props, events, and slots. Best when you want a declarative, template-driven API with minimal setup.
- **[Composables](/guide/vue/composables)** — Composition API functions that give you full control over the DOM structure and lifecycle. Best when you need more flexibility or want to integrate with existing markup.

Both approaches provide the same underlying functionality. Choose whichever fits your use case best.
