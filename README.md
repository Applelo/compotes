# Compotes

> A components library focused on customization/accessibility

## ✨ Features

- 👨‍🎨 Minimal CSS to do your customization
- 🦾 Accessibility in mind
- 📠 Fully typed

## 🍏 Compotes

- Drilldown
<!--
- Collapse
- Tabs
- Pagination
- Dropdown
-->

And more to come!

## 🍯 Pots

<details>
<summary>Vanilla JS/TS</summary><br>

```bash
npm i -D compotes

# yarn
yarn add -D compotes

# pnpm
pnpm add -D compotes
```

<br></details>

<!--<details>
<summary>Vue 3</summary><br>

```bash
npm i -D @compotes/vue

# yarn
yarn add -D @compotes/vue

# pnpm
pnpm add -D @compotes/vue
```

<br></details>

<details>
<summary>Nuxt 3</summary><br>

```bash
npm i -D @compotes/nuxt

# yarn
yarn add -D @compotes/nuxt

# pnpm
pnpm add -D @compotes/nuxt
```

<br></details>-->

> A proper documentation and Vue 3/Nuxt 3 packages will arrive soon stay tuned!

# Usage

```html
<nav class="c-drilldown" aria-label="Drilldown Example">
  <ul class="c-drilldown-menu">
    <li>
      <button class="c-drilldown-next">
        Go to section 1
      </button>
      <ul class="c-drilldown-menu" id="test">
        <li>
          <button class="c-drilldown-back">
            Go Back
          </button>
        </li>
        <li>
          <button class="c-drilldown-next">
            Go to section 1 1
          </button>
          <ul class="c-drilldown-menu">
            <li>
              <button class="c-drilldown-back">
                Go Back
              </button>
            </li>
            <li>
              Item Section 1 1
            </li>
            <li>
              Item Section 1 1
            </li>
          </ul>
        </li>
        <li>
          Item Section 1
        </li>
      </ul>
    </li>
  </ul>
</nav>
```

```ts
import 'compotes/css/drilldown.css' // loaded by vitejs
import { Drilldown } from 'compotes/drilldown'

const drilldown = new Drilldown('.c-drilldown', {
  dynamicHeight: true,
})
```

## 🙋‍♂️ Why ?

A lot of components library are already shipped with styles but as a Front End developer, I always wants to override a lot. Futhermore, there are not always accessible or they are shipped with jQuery.

There are some good library like [React Aria](https://react-spectrum.adobe.com/react-aria/react-aria-components.html) but it's made to work on one framework and I work on different tech like Wordpress, Symfony or VueJS.

> This library provide only the compotes and it's you to make a tart.

## 👨‍💼 License

MIT