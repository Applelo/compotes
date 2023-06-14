# Collapse / Accordion

The collapse component allow to collapse any elements you want. You can make an accordion with it for example.

> This component is inspired by the Collapse component from Bootstrap

```scss
@import 'compotes/css/collapse';
```

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse')
```

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

## Options

You can access some data from the component.

```js
import { Collapse } from 'compotes'

const collapse = new Collapse('#my-collapse', {
  init: false, // [!code focus:3]
  initAccessibilityAttrs: true,
  initEvents: true
})
collapse.init()
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
collapseElement.addEventListener('c.collapse.init', (e) => {
  console.log(e.detail)// collapse object
})
```

- `c.collapse.init`: On component init
- `c.collapse.show`: Show animation is launch
- `c.collapse.shown`: The collapse element is shown
- `c.collapse.hide`: Hide animation is launch
- `c.collapse.hidden`: The collapse element is hidden
- `c.collapse.destroy`: On component destroy