# Get started

## Browser support

**Compotes** uses modern browser APIs (`ResizeObserver`, `MutationObserver`, CSS variables, `:scope` selector) and does not support legacy browsers.

## Installation

1. Install the library with your favorite package manager

::: code-group

```sh [npm]
$ npm add -D compotes
```

```sh [pnpm]
$ pnpm add -D compotes
```

```sh [yarn]
$ yarn add -D compotes
```

```sh [bun]
$ bun add -D compotes
```

:::

2. Import the component(s) you want

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse')
```

::: info
If you need to initialize multiple elements, you need to use a loop.

```js
Array.from(document.getElementsByClassName('c-collapse'))
  .forEach(el => new Collapse(el))
```
:::

3. Import the CSS related to the component.

```css
/* All components */
@import 'compotes/css/style';

/* One component */
@import 'compotes/css/collapse';
```

::: info
The above import will work on modern building tools, like ViteJS and Webpack 5, which support package imports. If not, you can use the direct CSS location:

```css
@import 'compotes/style.css';
@import 'compotes/css/collapse.css';
```

If you use Sass, you can also import using `.scss` syntax:

```scss
@import 'compotes/css/style';
@import 'compotes/css/collapse';
```
:::

4. Use the HTML component markup

```html
<button class="c-collapse-trigger" aria-controls="my-collapse">
  Trigger collapse
</button>
<div class="c-collapse" id="my-collapse">
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus.
  </p>
</div>
```

5. That's it! Check each component for details about structure, advice for accessibility, options and more!
