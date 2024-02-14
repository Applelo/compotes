# Dropdown

The dropdown component allows to create a popup menu with links or whatever you want, open by a button.

```scss
@import 'compotes/css/dropdown';
```

```js
import { Dropdown } from 'compotes'

const dropdown = new Drag('.c-dropdown')
```

You can use any kind of element to trigger the dropdown, just add the `c-dropdown-trigger` class.

It is recommended to put an `id` to the dropdown container. On your trigger element, add an `aria-controls` attribute refering to the `id` of the dropdown.

```html
<!-- Default dropdown -->
<div class="c-dropdown">
  <button class="c-dropdown-trigger" aria-controls="my-dropdown">Basic Dropdown</button>
  <div class="c-dropdown-container" id="my-dropdown">
    Hello World
  </div>
</div>
```

If you are using a `ul` as a dropdown, it will use, by default, the `menu` mode adding accessibility features. You can change this by enforce the type of dropdown you want.

```html
<!-- Menu dropdown -->
<nav class="c-dropdown" aria-label="My superb dropdown menu">
  <a class="c-dropdown-trigger" aria-controls="my-dropdown">Item 1 - Dropdown Menu</a>
  <ul class="c-dropdown-container" id="my-dropdown">
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
  </ul>
</nav>
```

## Accessibility

To ensure accessibility feature, the component will inject `aria-expanded` to the trigger element. This allow the user to know if the collapse is expanded or not. The user also knows what element it refer thanks to the `aria-controls` attribute.

If you are using the `menu` type, it will inject `role` attributes on the `<ul>`, `<li>` and `<a>` elements.

## Options

You can change some options from the component.

```js
import { Dropdown } from 'compotes'

const drag = new Drag('.c-drag', {
  init: true, // [!code focus:6]
  initEvents: true,
  enforceType: undefined,
  openOn: 'click',
  equalizeWidth: undefined,
  mutationObserver: true,
})
```

- `init` (boolean): Init the component on creation
- `initEvents` (boolean): Init events on the component
- `enforceType` ('default' or 'menu'): The type of the dropdown
- `openOn` ('click' or 'hover'): Open the dropdown on click/hover from the trigger element
- `equalizeWidth` (boolean): Equalize width on the trigger and the container. It will refresh on mutation observer (if enable)
- `mutationObserver` (boolean): Use MutationObserver to update component on changes

## Methods

The dropdown component provides several methods to init and destroy the component and also open/toggle/close event.

```js
import { Dropdown } from 'compotes'

const dropdown = new Drag('.c-dropdown', {
  init: false
})
dropdown.init()// [!code focus]
```

- `init()`: Init the component
- `initAccessibilityAttrs()`: Init accessibility attributes
- `initEvents()`: Init component events
- `initAccessibilityEvents()`: Init component accessibility events
- `destroyEvents()`: Destroy the component events
- `destroy()`: Destroy the component
- `open()`: Open the dropdown
- `toggle()`: Toggle the dropdown
- `close()`: Close the dropdown
- `equalizeWidth()`: Equalize the width of the container and the trigger of the dropdown

## Data

You can access data from the component like this:

```js
import { Dropdown } from 'compotes'

const dropdown = new Drag('.c-dropdown')
console.log(dropdown.isOpen)// [!code focus]
```

- `options` (options object): Get options used to init the component
- `isOpen` (boolean): Tell if the dropdown is open or not
- `type` ('default' or 'menu'): Tell the current type of dropdown

## Events

You can listen to emitted events directly on the dropdown element like this:

```js
import { Dropdown } from 'compotes'

const dropdownEl = document.querySelector('.c-dropdown')
const dropdown = new Drag(dropdownEl)

dropdownEl.addEventListener('c.dropdown.init', (e) => { // [!code focus:3]
  console.log(e.detail)// drag object
})
```

- `c.dropdown.init`: On component init
- `c.dropdown.destroy`: On component destroy
- `c.dropdown.opened`: On dropdown open
- `c.dropdown.closed`: On dropdown close
