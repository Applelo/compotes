# Drag

The drag component allows you to create a draggable zone you can control with your mouse.

```scss
@import 'compotes/css/drag';
```

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag')
```

You need to have elements overflowing inside the component because it uses the CSS property `overflow: auto;`.

```html

<div class="c-drag">
  <!-- Your overflowing content -->
</div>
```

## Options

You can change some options from the component.

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag', {
  init: true, // [!code focus:2]
})
```

- `init` (boolean): Init the component on creation

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
dragEl.addEventListener('c.drag.init', (e) => { // [!code focus:3]
  console.log(e.detail)// drag object
})
```

- `c.drag.init`: On component init
- `c.drag.start`: On component drag start
- `c.drag.end`: On component drag end
- `c.drag.destroy`: On component destroy
