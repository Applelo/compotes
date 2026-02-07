# Vue Composables

The [composable](https://vuejs.org/guide/reusability/composables.html) are the easy way to connect Compotes into VueJS hooks.

First, [use a ref to get your HTMLElement ](https://vuejs.org/guide/essentials/template-refs.html) and pass it to your composable as a first argument.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'

const marqueeEl = ref<HTMLElement | null>(null)
const marquee = useMarquee(marqueeEl)
</script>
```

::: info
You can also pass a string for `querySelector` your element, as first argument, but it is recommanded to pass ref for proper Vue integration.
:::

As the second argument, you can pass the options of the component.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'

const marqueeEl = ref<HTMLElement | null>(null)
const marquee = useMarquee(marqueeEl, { fill: true })
</script>
```

For the template, you need to respect the structure of the component you reference.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'

const marqueeEl = ref<HTMLElement | null>(null)
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
That's it for Vue composable.

## List

 - useCollapse(el, [options](/guide/collapse#options))
 - useDrag(el, [options](/guide/drag#options))
 - useDrilldown(el, [options](/guide/drilldown#options))
 - useDropdown(el, [options](/guide/dropdown#options))
 - useMarquee(el, [options](/guide/marquee#options))

## Methods

You can access all the component methods through the composable. There will be available after the mounted vue lifecycle hook.
Here an example with the marquee component with a simple play/pause implementation.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'

const marqueeEl = ref<HTMLElement | null>(null)
const marquee = useMarquee(marqueeEl, { fill: true })
</script>

<template>
  <button @click="marquee?.pause()">
    Pause
  </button>
  <button @click="marquee?.play()">
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

## Data

All the component data are available after the mounted vue lifecycle hook.

Here an example to show the current status of the collapse component.

```vue
<script setup lang="ts">
import { useMarquee } from '@compotes/vue'

const marqueeEl = ref<HTMLElement | null>(null)
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
