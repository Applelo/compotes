---
next: false
---

# Drilldown

This component allows you to build a compact menu. This can be useful to make a mobile one.

> This component is inspired by the [Foundation](https://get.foundation/sites/docs/drilldown-menu.html) component.

```scss
@import 'compotes/css/drilldown';
```

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown')
```

You need to structure the component like below imbricating `ul` and `li`. If you want to go to the next menu, you will need to add a next button with `c-drilldown-next` class just before the `c-drilldown-menu`.
To go back, you will need to add an entry to your `ul` menu containing a back button with `c-drilldown-back`.

::: warning
You should respect the structure and elements tags used in this component. It will ensure the component to work properly with accessibility.
:::

```html
<nav class="c-drilldown" aria-label="Mobile menu">
  <ul class="c-drilldown-menu">
    <li>
      <button class="c-drilldown-next">
        Go to section 1
      </button>
      <ul class="c-drilldown-menu" id="section-1">
        <li>
          <button class="c-drilldown-back">
            Go Back
          </button>
        </li>
        <li>
          <button class="c-drilldown-next">
            Go to section 1 1
          </button>
          <ul class="c-drilldown-menu" id="section-1-1">
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
    <li>
      Item
    </li>
  </ul>
</nav>
```

## Accessibility

This component inject a lot of aria attribute to ensure a good accessibility coverage:
- Add role `menubar` on first menu
- Set `aria-multiselectable` to `false`
- Set `aria-orientation` to `vertical`
- Add role `menu` to all child menu
- Disable list item role for `li` with `none` role
- Add role `menuitem` to back and next button
- Add `aria-expanded`, `aria-controls` to next button
- Add a basic `id` if is not set to the menu

::: info
You should add an `id` attribute to every menu inside your main menu (like the example above). By default, the plugin will generate an `id` attribute if it doesn't find one but to prevent `id` naming issue, I recommend to put one.
:::

The drilldown menu comes with keyboard shortcut if your focus is inside the component :
- ArrowUp: Focus to previous element
- ArrowDown: Focus to the next element
- ArrowLeft/Escape: Go back
- ArrowRight: Go to the next menu if your focus is on the next button
- Home/PageUp: Focus first of the current menu
- End/PageDown: Focus last element of the current menu
- And do a focus with first element found with the char you have pressed

## Options

You can change some options from the component.

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown', {
  init: true, // [!code focus:5]
  dynamicHeight: false,
  mutationObserver: true,
})
```

- `init` (boolean): Init the component on creation
- `dynamicHeight` (boolean): By default, the height of the drilldown is the tallest menu found. You can set this option to `true` to update the height to the current menu.
- `mutationObserver` (boolean): Use MutationObserver to update component on changes

## Methods

The collapse component provides several methods allowing you to control the component programatically.

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown')
drilldown.reset()// [!code focus]
```

- `init()`: Init the component
- `update()`: Update drilldown trigger status
- `reset()`: Reset the drilldown to the root menu
- `back()`: Back to the previous menu
- `destroy()`: Destroy the component

## Data

You can access data from the component like this:

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown')
console.log(drilldown.options)// [!code focus]
```

- `options` (options object): Get options used to init the component

## Events

You can listen to emitted events directly on the drilldown element like this:

```js
drilldownElement.addEventListener('c.drilldown.init', (e) => {
  console.log(e.detail)// drilldown object
})
```

- `c.drilldown.init`: On component init
- `c.drilldown.update`: On component update
- `c.drilldown.next`: On next
- `c.drilldown.back`: On back
- `c.drilldown.reset`: On reset
- `c.drilldown.destroy`: On component destroy
