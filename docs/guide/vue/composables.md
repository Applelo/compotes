# Vue Composables

The [composable](https://vuejs.org/guide/reusability/composables.html) are the easy way to connect Compotes into VueJS hooks.

First, [use a ref to get your HTMLElement ](https://vuejs.org/guide/essentials/template-refs.html) and pass it to your composable as a first argument.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'
import { useTemplateRef } from 'vue'
import 'compotes/css/marquee.css'

const marqueeEl = useTemplateRef<HTMLElement>('marqueeEl')
const marquee = useMarquee(marqueeEl)
</script>
```

As the second argument, you can pass the options of the component.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'
import { useTemplateRef } from 'vue'
import 'compotes/css/marquee.css'

const marqueeEl = useTemplateRef<HTMLElement>('marqueeEl')
const marquee = useMarquee(marqueeEl, { fill: true })
</script>
```

For the template, you need to respect the structure of the component you reference.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'
import { useTemplateRef } from 'vue'
import 'compotes/css/marquee.css'

const marqueeEl = useTemplateRef<HTMLElement>('marqueeEl')
const marquee = useMarquee(marqueeEl, { fill: true })
</script>

<template>
  <div ref="marqueeEl" class="c-marquee">
    <ul class="c-marquee-container">
      <li>This is the default marquee</li>
      <li>Marquee or marquii</li>
    </ul>
  </div>
</template>
```

::: warning
Don't forget to import the CSS of the component you want to use!
:::

That's it for the basic Vue composable setup.

## List

| Composable | State | Methods |
|------------|-------|---------|
| useCollapse(el, [options](/guide/collapse#options)) | `instance`, `isExpanded`, `isCollapsing` | `show()`, `hide()`, `toggle()`, `update()`, `destroy()` |
| useDrag(el, [options](/guide/drag#options)) | `instance`, `isDragging`, `isDraggable` | `destroy()` |
| useDrilldown(el, [options](/guide/drilldown#options)) | `instance`, `level`, `currentMenuId` | `update(reloadItems?)`, `back()`, `reset()`, `destroy()` |
| useDropdown(el, [options](/guide/dropdown#options)) | `instance`, `isOpen`, `type` | `open()`, `close()`, `toggle()`, `update()`, `equalizeWidth()`, `destroy()` |
| useMarquee(el, [options](/guide/marquee#options)) | `instance`, `isPaused` | `play()`, `pause()`, `update(fill?)`, `destroy()` |

## Methods

You can access the component methods through the composable. They will be available after the mounted vue lifecycle hook.
For advanced usage, `instance` gives access to the underlying Compotes class instance.
Here an example with the marquee component with a simple play/pause implementation.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'
import { useTemplateRef } from 'vue'
import 'compotes/css/marquee.css'

const marqueeEl = useTemplateRef<HTMLElement>('marqueeEl')
const marquee = useMarquee(marqueeEl, { fill: true })
</script>

<template>
  <button @click="marquee.pause()">
    Pause
  </button>
  <button @click="marquee.play()">
    Play
  </button>
  <div ref="marqueeEl" class="c-marquee">
    <ul class="c-marquee-container">
      <li>This is the default marquee</li>
      <li>Marquee or marquii</li>
    </ul>
  </div>
</template>
```

## State

All the component state properties are reactive after the mounted vue lifecycle hook.
You can use them directly in templates and `<script setup>`. If you need a ref, use `toRef` on the returned object.

### useCollapse

| State | Type | Description |
|-------|------|-------------|
| `instance` | `Collapse \| null` | The underlying Compotes Collapse instance |
| `isExpanded` | `boolean` | Whether the collapse is currently expanded |
| `isCollapsing` | `boolean` | Whether the collapse is currently animating |

### useDrag

| State | Type | Description |
|-------|------|-------------|
| `instance` | `Drag \| null` | The underlying Compotes Drag instance |
| `isDragging` | `boolean` | Whether the element is currently being dragged |
| `isDraggable` | `boolean` | Whether the element is draggable (updates on resize) |

### useDrilldown

| State | Type | Description |
|-------|------|-------------|
| `instance` | `Drilldown \| null` | The underlying Compotes Drilldown instance |
| `level` | `number` | The current navigation depth level |
| `currentMenuId` | `string \| null` | The ID of the currently active menu |

### useDropdown

| State | Type | Description |
|-------|------|-------------|
| `instance` | `Dropdown \| null` | The underlying Compotes Dropdown instance |
| `isOpen` | `boolean` | Whether the dropdown is currently open |
| `type` | `'default' \| 'menu'` | The current type of the dropdown |

### useMarquee

| State | Type | Description |
|-------|------|-------------|
| `instance` | `Marquee \| null` | The underlying Compotes Marquee instance |
| `isPaused` | `boolean` | Whether the marquee is currently paused |

Here an example to show the current status of the marquee component.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'
import { useTemplateRef } from 'vue'
import 'compotes/css/marquee.css'

const marqueeEl = useTemplateRef<HTMLElement>('marqueeEl')
const marquee = useMarquee(marqueeEl, { fill: true })
</script>

<template>
  <div>{{ marquee.isPaused ? 'Paused' : 'Playing' }}</div>
  <div ref="marqueeEl" class="c-marquee">
    <ul class="c-marquee-container">
      <li>This is the default marquee</li>
      <li>Marquee or marquii</li>
    </ul>
  </div>
</template>
```

## Events

Events are automatically handled by the composables. The reactive state is kept in sync with the component by listening to the underlying events. You don't need to manually subscribe to events – simply use the reactive state properties provided by each composable.

If you need to listen to events directly, you can access them through the `instance` property:

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'
import { useTemplateRef, watchEffect } from 'vue'
import 'compotes/css/marquee.css'

const marqueeEl = useTemplateRef<HTMLElement>('marqueeEl')
const marquee = useMarquee(marqueeEl, { fill: true })

watchEffect((onCleanup) => {
  if (!marquee.instance?.el)
    return

  const handler = () => console.log('Marquee started playing!')
  marquee.instance.el.addEventListener('c.marquee.play', handler)

  onCleanup(() => {
    marquee.instance?.el?.removeEventListener('c.marquee.play', handler)
  })
})
</script>
```

For a list of available events for each component, refer to their respective documentation pages.
