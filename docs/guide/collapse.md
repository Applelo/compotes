# Collapse / Accordion

The collapse component allows to collapse any elements you want. You can make an accordion with it for example.

> This component is inspired by the [Collapse](https://getbootstrap.com/docs/5.3/components/collapse/) component from Bootstrap.

```scss
@import 'compotes/css/collapse';
```

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse')
```

You need to put an `id` to the element you want to collapse. To all your trigger buttons, add an `aria-controls` attribute refering to the `id` of the collapse.

```html
<button class="c-collapse-trigger" aria-controls="my-collapse">
  Trigger collapse
</button>
<div class="c-collapse" id="my-collapse">
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
    Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus.
  </p>
</div>
```

To make the collapse open by default, add the `c-collapse--show` class on the collapse element.

```html
<button class="c-collapse-trigger" aria-controls="my-collapse">
  Trigger collapse
</button>
// [!code focus:2]
<div class="c-collapse c-collapse--show" id="my-collapse">
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
    Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus.
  </p>
</div>
```

## Accessibility

To ensure accessibility feature, the component will inject `aria-expanded` to all trigger elements. This allow the user to know if the collapse is expanded or not. The user also knows what element it refer thanks to the `aria-controls` attribute.

## Options

You can access some data from the component.

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse', {
  init: true, // [!code focus:3]
  initAccessibilityAttrs: true,
  initEvents: true
})
```

- `init` (boolean): Init the component on creation
- `initAccessibilityAttrs` (boolean): Init accessibility attributes on the component
- `initEvents` (boolean): Init events on the component

## Methods

The collapse component provides several methods allowing you to control the component programatically.

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse')
collapse.show()// [!code focus]
```

- `init()`: Init the component
- `initAccessibilityAttrs()`: Init accessibility attributes
- `initEvents()`: Init component events
- `update()`: Update collapse trigger status
- `hide()`: Hide element
- `show()`: Show element
- `toggle()`: Toggle element
- `destroyEvents()`: Destroy the component events
- `destroy()`: Destroy the component

## Data

You can access data from the component like this:

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse')
console.log(collapse.expanded)// [!code focus]
```

- `options` (options object): Get options used to init the component
- `isExpanded` (boolean): If the collapse element is expanded or not
- `isCollapsing` (boolean): If the collapse is in his collapsing animation

## Events

You can listen to emitted event directly on the collapse element like this:

```js
import { Collapse } from 'compotes'

const collapseElement = document.getElementById('my-collapse')
const collapse = new Collapse(collapseElement)
collapseElement.addEventListener('c.collapse.init', (e) => { // [!code focus:3]
  console.log(e.detail)// collapse object
})
```

- `c.collapse.init`: On component init
- `c.collapse.show`: Show animation is launch
- `c.collapse.shown`: The collapse element is shown
- `c.collapse.hide`: Hide animation is launch
- `c.collapse.hidden`: The collapse element is hidden
- `c.collapse.destroy`: On component destroy