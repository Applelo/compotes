# Drag

The drag component allows you to create a draggable zone you can scroll by clicking and dragging.

```scss
@import 'compotes/css/drag';
```

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag')
```

The element must have overflowing content, as the component relies on `overflow: auto` to enable scrolling.

```html

<div class="c-drag">
  <!-- Your overflowing content -->
</div>
```

## Accessibility

This component does not add specific accessibility features. It provides a mouse-driven scrolling experience for overflowing content.

## Options

You can change some options from the component.

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag', {
  init: true, // [!code focus:3]
  on: undefined,
})
```

- `init` (boolean): Init the component on creation
- `on` (object): events to listen to

## Methods

The drag component provides several methods to init and destroy it.

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag', {
  init: false
})
drag.init()// [!code focus]
```

- `init()`: Init the component
- `destroy()`: Destroy the component

## Data

You can access data from the component like this:

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag')
console.log(drag.isDraggable)// [!code focus]
```

- `options` (options object): Get options used to init the component
- `isDraggable` (boolean): Indicates if the component is draggable or not
- `isDragging` (boolean): Indicates if the component is currently dragging or not

## Events

You can listen to emitted events directly on the drag element like this:

```js
import { Drag } from 'compotes'

const dragEl = document.querySelector('.c-drag')
const drag = new Drag(dragEl)

dragEl.addEventListener('c.drag.init', (e) => { // [!code focus:3]
  console.log(e.detail)// drag object
})
```

- `c.drag.init`: On component init
- `c.drag.start`: On component drag start
- `c.drag.end`: On component drag end
- `c.drag.destroy`: On component destroy
