# Marquee

The marquee component allows to create an animated text copying the old [marquee](https://developer.mozilla.org/fr/docs/Web/HTML/Element/marquee) element with modern support.

```scss
@import 'compotes/css/marquee';
```

```js
import { Marquee } from 'compotes'

const marquee = new Marquee('.c-marquee')
```

The structure consists to a list of element. All animation are CSS based.

```html

<div class="c-marquee">
  <ul class="c-marquee-container">
    <li>This is the default marquee</li>
    <li>Marquee or marquii</li>
  </ul>
</div>
```

You are not limited to text. You can also add any kind of valid HTML like image.

## Accessibility

- Make the marquee tabbable and stop it if it is in focus via the keyboard
- If the user has configure `prefers-reduced-motion` on his browser, the marquee animation will not be played.
- If you are using the `fill` option, all cloned element will be set to `aria-hidden` to hide the non necessary content to the screen reader and not be tabbable thank to a `tabindex="-1"`.
- If an element is focus with the keyboard, the marquee animation will be stop.

## Options

You can change some options from the component.

```js
import { Marquee } from 'compotes'

const marquee = new Marquee('.c-marquee', {
  init: true, // [!code focus:6]
  initEvents: true,
  fill: false,
  direction: 'right',
  behavior: 'scroll',
  duration: 1,
  mutationObserver: true
})
```

- `init` (boolean): Init the component on creation
- `initEvents` (boolean): Init events on the component
- `fill` (boolean): Fill the marquee to make a loop
- `direction` ('left' | 'right' | 'up' | 'down'): Direction of marquee animation
- `behavior` ('scroll' | 'alternate'): The behavior the marquee animation
- `duration` (number or string): The duration of the marquee animation
- `mutationObserver` (boolean): Use MutationObserver to update component on changes

## Methods

The marquee component provides several methods to init and destroy it. You can also control the marquee animation.

```js
import { Marquee } from 'compotes'

const marquee = new Marquee('.c-marquee', {
  init: false
})
marquee.init()// [!code focus]
```

- `init()`: Init the component
- `initEvents()`: Init component events
- `destroyEvents()`: Destroy the component events
- `destroy()`: Destroy the component
- `update()`: Update the marquee component
- `play()`: Play the marquee component
- `pause()`: Pause the marquee component

## Data

You can access data from the component like this:

```js
import { Marquee } from 'compotes'

const marquee = new Marquee('#my-marquee')
console.log(marquee.isPaused)// [!code focus]
```

- `options` (options object): Get options used to init the component
- `isPaused` (boolean): If the marquee is paused or not

## Events

You can listen to emitted events directly on the marquee element like this:

```js
marqueeEl.addEventListener('c.marquee.init', (e) => { // [!code focus:3]
  console.log(e.detail)// marquee object
})
```

- `c.marquee.init`: On component init
- `c.marquee.play`: On component marquee play
- `c.marquee.pause`: On component marquee pause
- `c.marquee.loop`: On component marquee loop
- `c.marquee.destroy`: On component destroy
