# Drag

The drag component allows to create a draggable zone you can control with your mouse.

```scss
@import 'compotes/css/drag';
```

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag')
```

You need to have a width and/or height define on the component because it uses `overflow: auto;`.

```html

<div class="c-drag">
  <!-- Your overflowing content -->
</div>
```

## Options

You can access some data from the component.

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag', {
  init: true, // [!code focus:2]
  initEvents: true
})
```

- `init` (boolean): Init the component on creation
- `initEvents` (boolean): Init events on the component

## Methods

The drag component provides several methods to init and destroy the components.

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag', {
  init: false
})
drag.init()// [!code focus]
```

- `init()`: Init the component
- `initEvents()`: Init component events
- `destroyEvents()`: Destroy the component events
- `destroy()`: Destroy the component

## Data

You can access data from the component like this:

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag')
console.log(drag.isDraggable)// [!code focus]
```

- `options` (options object): Get options used to init the component
- `isDraggable` (boolean): Tell if the component is draggable or not
- `isDragging` (boolean): Tell if the component is currently dragging or not

## Events

You can listen to emitted events directly on the drag element like this:

```js
import { Drag } from 'compotes'

const drag = new Drag('.c-drag')
drag.addEventListener('c.drag.init', (e) => { // [!code focus:3]
  console.log(e.detail)// drag object
})
```

- `c.drag.init`: On component init
- `c.drag.start`: On component drag start
- `c.drag.end`: On component drag end
- `c.drag.destroy`: On component destroy