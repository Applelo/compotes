# Components

The Vue package provides a set of components that wrap the core functionality of Compote.

**Available components:** [CCollapse](#ccollapse) · [CCollapseTrigger](#ccollapsetrigger) · [CDrag](#cdrag) · [CDrilldown](#cdrilldown) · [CDrilldownMenu](#cdrilldownmenu) · [CDrilldownNext](#cdrilldownnext) · [CDrilldownBack](#cdrilldownback) · [CDropdown](#cdropdown) · [CDropdownMenu](#cdropdownmenu) · [CDropdownTrigger](#cdropdowntrigger) · [CMarquee](#cmarquee)

All components support the `as` prop, which lets you change the rendered HTML tag or pass a custom Vue component. They also forward attributes via `v-bind="$attrs"` and provide a default slot for content.

::: warning
You need to import the CSS manually to make the components work.

```ts
import 'compotes/css'
```

or individually per component

```ts
import 'compotes/css/collapse'
```
:::

## CCollapse

A collapsible component that can show or hide content.

### Usage

```vue
<script setup lang="ts">
import { CCollapse, CCollapseTrigger } from '@compotes/vue'
</script>

<template>
  <div>
    <CCollapseTrigger aria-controls="my-collapse">
      Toggle
    </CCollapseTrigger>
    <CCollapse id="my-collapse">
      <p>Collapsible content here.</p>
    </CCollapse>
  </div>
</template>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `id` | `string` | *required* | The unique identifier for the collapse. Used to link with `CCollapseTrigger` via `aria-controls`. |
| `options` | `CollapseOptions` | - | Configuration options for the collapse instance. See [Collapse options](/guide/collapse#options). |
| `defaultOpen` | `boolean` | `false` | Whether the collapse should be open by default. Adds the `c-collapse--show` class on mount. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Collapse>` | Emitted when the collapse instance is initialized. |
| `show` | `CustomEvent<Collapse>` | Emitted when the collapse starts showing. |
| `shown` | `CustomEvent<Collapse>` | Emitted when the collapse has finished showing. |
| `hide` | `CustomEvent<Collapse>` | Emitted when the collapse starts hiding. |
| `hidden` | `CustomEvent<Collapse>` | Emitted when the collapse has finished hiding. |
| `update` | `CustomEvent<Collapse>` | Emitted when the collapse state updates. |
| `destroy` | `CustomEvent<Collapse>` | Emitted when the collapse instance is destroyed. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The collapse content, including trigger and collapsible elements. |

### Exposed

The component exposes the underlying `collapse` composable return value (state + actions). See [useCollapse](/guide/vue/composables#usecollapse).

## CCollapseTrigger

A button component to toggle the `CCollapse`. Can be placed inside or outside a `CCollapse` component.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |
| `ariaControls` | `string` | *required* | The ID of the collapse element this trigger controls. Sets the `aria-controls` attribute. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The trigger button content. |

::: info
When rendered as a `button`, the component automatically sets `type="button"`.

To link the trigger with a collapse element, pass the collapse's `id` to the `CCollapseTrigger`'s `aria-controls` prop. This sets the `aria-controls` attribute for proper accessibility.

The component applies the `c-collapse-trigger` CSS class.
:::

## CDrag

A generic draggable component.

### Usage

```vue
<script setup lang="ts">
import { CDrag } from '@compotes/vue'
</script>

<template>
  <CDrag>
    <div>Drag me!</div>
  </CDrag>
</template>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `options` | `DragOptions` | - | Configuration options for the drag instance. See [Drag options](/guide/drag#options). |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Drag>` | Emitted when the drag instance is initialized. |
| `start` | `CustomEvent<Drag>` | Emitted when dragging starts. |
| `end` | `CustomEvent<Drag>` | Emitted when dragging ends. |
| `destroy` | `CustomEvent<Drag>` | Emitted when the drag instance is destroyed. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The draggable content. |

### Exposed

The component exposes the underlying `drag` composable return value (state + actions). See [useDrag](/guide/vue/composables#usedrag).

## CDrilldown

A drilldown menu component for hierarchical navigation.

### Usage

```vue
<script setup lang="ts">
import {
  CDrilldown,
  CDrilldownBack,
  CDrilldownMenu,
  CDrilldownNext,
} from '@compotes/vue'
</script>

<template>
  <CDrilldown>
    <CDrilldownMenu>
      <li>
        <CDrilldownNext>Fruits</CDrilldownNext>
        <CDrilldownMenu>
          <li><CDrilldownBack>Back</CDrilldownBack></li>
          <li>Apple</li>
          <li>Banana</li>
        </CDrilldownMenu>
      </li>
      <li>
        <CDrilldownNext>Vegetables</CDrilldownNext>
        <CDrilldownMenu>
          <li><CDrilldownBack>Back</CDrilldownBack></li>
          <li>Carrot</li>
          <li>Broccoli</li>
        </CDrilldownMenu>
      </li>
    </CDrilldownMenu>
  </CDrilldown>
</template>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'nav'` | The HTML tag or component to render. |
| `options` | `DrilldownOptions` | - | Configuration options for the drilldown instance. See [Drilldown options](/guide/drilldown#options). |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Drilldown>` | Emitted when the drilldown instance is initialized. |
| `destroy` | `CustomEvent<Drilldown>` | Emitted when the drilldown instance is destroyed. |
| `update` | `CustomEvent<Drilldown>` | Emitted when the drilldown updates. |
| `next` | `CustomEvent<Drilldown>` | Emitted when navigating to the next level. |
| `back` | `CustomEvent<Drilldown>` | Emitted when navigating back. |
| `reset` | `CustomEvent<Drilldown>` | Emitted when the drilldown is reset. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The drilldown structure with menus, next and back buttons. |

### Exposed

The component exposes the underlying `drilldown` composable return value (state + actions). See [useDrilldown](/guide/vue/composables#usedrilldown).

## CDrilldownMenu

A container for drilldown menu items. Renders with the `c-drilldown-menu` CSS class.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'ul'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the menu. If not provided, one will be generated. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The menu items (`<li>` elements). |

## CDrilldownNext

A button to navigate to the next level in the drilldown. Renders with the `c-drilldown-next` CSS class.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The button content. |

::: info
When rendered as a `button`, the component automatically sets `type="button"`.
:::

## CDrilldownBack

A button to navigate back in the drilldown. Renders with the `c-drilldown-back` CSS class.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The button content. |

::: info
When rendered as a `button`, the component automatically sets `type="button"`.
:::

## CDropdown

A dropdown component.

### Usage

```vue
<script setup lang="ts">
import { CDropdown, CDropdownMenu, CDropdownTrigger } from '@compotes/vue'
</script>

<template>
  <CDropdown>
    <CDropdownTrigger>Open menu</CDropdownTrigger>
    <CDropdownMenu>
      <a href="#">Option 1</a>
      <a href="#">Option 2</a>
    </CDropdownMenu>
  </CDropdown>
</template>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the dropdown. If not provided, one will be generated. |
| `options` | `DropdownOptions` | - | Configuration options for the dropdown instance. See [Dropdown options](/guide/dropdown#options). |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Dropdown>` | Emitted when the dropdown instance is initialized. |
| `opened` | `CustomEvent<Dropdown>` | Emitted when the dropdown opens. |
| `closed` | `CustomEvent<Dropdown>` | Emitted when the dropdown closes. |
| `destroy` | `CustomEvent<Dropdown>` | Emitted when the dropdown instance is destroyed. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The dropdown structure, including trigger and menu. |

### Exposed

The component exposes the underlying `dropdown` composable return value (state + actions). See [useDropdown](/guide/vue/composables#usedropdown).

### Context

`CDropdown` provides its resolved `menuId` to child components via Vue's provide/inject. This allows `CDropdownTrigger` and `CDropdownMenu` to automatically wire up `aria-controls` and menu IDs.

## CDropdownMenu

The container for the dropdown content. Renders with the `c-dropdown-container` CSS class.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the menu. If not provided, the ID from the parent `CDropdown` context is used. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The dropdown menu content. |

## CDropdownTrigger

The button to toggle the dropdown. Must be placed inside a `CDropdown` component.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The trigger button content. |

::: info
When rendered as a `button`, the component automatically sets `type="button"`. It also auto-sets `aria-controls` from the parent `CDropdown` context via the menu ID.

The component applies the `c-dropdown-trigger` CSS class.
:::

## CMarquee

A scrolling marquee component. Unlike other components, `CMarquee` manages its own inner container element via the `containerAs` prop.

### Usage

```vue
<script setup lang="ts">
import { CMarquee } from '@compotes/vue'
</script>

<template>
  <CMarquee>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </CMarquee>
</template>
```

The rendered HTML structure is:

```html
<div class="c-marquee">          <!-- as (outer element) -->
  <ul class="c-marquee-container"> <!-- containerAs (inner container) -->
    <li>Item 1</li>                 <!-- slot content -->
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component for the outer element. |
| `containerAs` | `string \| Component` | `'ul'` | The HTML tag or component for the inner container. |
| `options` | `MarqueeOptions` | - | Configuration options for the marquee instance. See [Marquee options](/guide/marquee#options). |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Marquee>` | Emitted when the marquee instance is initialized. |
| `play` | `CustomEvent<Marquee>` | Emitted when the marquee starts playing. |
| `pause` | `CustomEvent<Marquee>` | Emitted when the marquee pauses. |
| `loop` | `CustomEvent<Marquee>` | Emitted when the marquee completes a loop. |
| `destroy` | `CustomEvent<Marquee>` | Emitted when the marquee instance is destroyed. |

### Slots

| Name | Description |
| --- | --- |
| `default` | The marquee items, placed inside the inner container. |

### Exposed

The component exposes the underlying `marquee` composable return value (state + actions). See [useMarquee](/guide/vue/composables#usemarquee).

## Accessing Exposed Values

Use a template ref to access the exposed composable from a parent component:

```vue
<script setup lang="ts">
import { CCollapse, CCollapseTrigger } from '@compotes/vue'
import { useTemplateRef } from 'vue'

const collapseRef = useTemplateRef('myCollapse')

function openCollapse() {
  collapseRef.value?.show()
}
</script>

<template>
  <button @click="openCollapse">
    Open from outside
  </button>
  <CCollapse ref="myCollapse">
    <p>Content here.</p>
  </CCollapse>
</template>
```
