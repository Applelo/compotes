---
next: false
---

# Drilldown

The drilldown menu can be use for mobile.

> This component is inspired by the [Foundation](https://get.foundation/sites/docs/drilldown-menu.html) component.

```scss
@import 'compotes/css/drilldown';
```

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown')
```

## Options

You can access some data from the component.

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown', {
  init: true, // [!code focus:4]
  initAccessibilityAttrs: true,
  initEvents: true,
  dynamicHeight: false
})
```

- `init` (boolean): Init the component on creation
- `initAccessibilityAttrs` (boolean): Init accessibility attributes on the component
- `initEvents` (boolean): Init events on the component
- `dynamicHeight` (boolean): By default, the height of the drilldown is the tallest menu found. You can set this option to `true` to update the height to the current menu.


## Methods

The collapse component provides several methods allowing you to control the component programatically.

```js
import { Drilldown } from 'compotes'

const drilldown = new Collapse('#my-drilldown')
drilldown.reset()// [!code focus]
```

- `init()`: Init the component
- `initAccessibilityAttrs()`: Init accessibility attributes
- `initEvents()`: Init component events
- `update()`: Update drilldown trigger status
- `reset()`: Reset the drilldown to the root menu
- `back()`: Back to the previous menu
- `destroyEvents()`: Destroy the component events
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

You can listen to emitted event directly on the drilldown element like this:

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