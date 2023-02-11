# Compotes

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> A components library focused on accessibility/customization

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

## Quick Setup

1. Add `@compotes/nuxt` dependency to your project

```bash
# Using pnpm
pnpm add -D @compotes/nuxt

# Using yarn
yarn add --dev @compotes/nuxt

# Using npm
npm install --save-dev @compotes/nuxt
```

2. Add `@compotes/nuxt` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@compotes/nuxt'
  ]
})
```

That's it! You can now use Compotes in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@compotes/nuxt/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@compotes/nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/@compotes/nuxt.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@compotes/nuxt

[license-src]: https://img.shields.io/npm/l/@compotes/nuxt.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@compotes/nuxt
