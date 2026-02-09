# Components

The Vue package provides a set of components that wrap the core functionality of Compote.


::: warning
You need to import the css manually to make the components work.

```ts
import 'compotes/css'
```

or component by component

```ts
import 'compotes/css/collapse'
```
:::

## CCollapse

A collapsible component that can show or hide content.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the collapse. If not provided, one will be generated. |
| `options` | `CollapseOptions` | - | Configuration options for the collapse instance. |
| `defaultOpen` | `boolean` | `false` | Whether the collapse should be open by default. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Collapse>` | Emitted when the collapse instance is initialized. |
| `show` | `CustomEvent<Collapse>` | Emitted when the collapse starts showing. |
| `shown` | `CustomEvent<Collapse>` | Emitted when the collapse has finished showing. |
| `hide` | `CustomEvent<Collapse>` | Emitted when the collapse starts hiding. |
| `hidden` | `CustomEvent<Collapse>` | Emitted when the collapse has finished hiding. |
| `update` | `CustomEvent<Collapse>` | Emitted when the collapse state updates. |
| `destroy` | `CustomEvent<Collapse>` | Emitted when the collapse instance is destroyed. |

### Exposed

The component exposes the underlying `collapse` instance.

## CCollapseTrigger

A button component to toggle the `CCollapse`.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

This component automatically handles `aria-controls` if placed within a context of `CCollapse` or if the `id` is properly linked.

## CDrag

A generic draggable component.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `options` | `DragOptions` | - | Configuration options for the drag instance. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Drag>` | Emitted when the drag instance is initialized. |
| `start` | `CustomEvent<Drag>` | Emitted when dragging starts. |
| `end` | `CustomEvent<Drag>` | Emitted when dragging ends. |
| `destroy` | `CustomEvent<Drag>` | Emitted when the drag instance is destroyed. |

### Exposed

The component exposes the underlying `drag` instance.

## CDrilldown

A drilldown menu component for hierarchical path navigation.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'nav'` | The HTML tag or component to render. |
| `options` | `DrilldownOptions` | - | Configuration options for the drilldown instance. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Drilldown>` | Emitted when the drilldown instance is initialized. |
| `destroy` | `CustomEvent<Drilldown>` | Emitted when the drilldown instance is destroyed. |
| `update` | `CustomEvent<Drilldown>` | Emitted when the drilldown updates. |
| `next` | `CustomEvent<Drilldown>` | Emitted when navigating to the next level. |
| `back` | `CustomEvent<Drilldown>` | Emitted when navigating back. |
| `reset` | `CustomEvent<Drilldown>` | Emitted when the drilldown is reset. |

### Exposed

The component exposes the underlying `drilldown` instance.

## CDrilldownMenu

A container for drilldown menu items.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'ul'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the menu. If not provided, one will be generated. |

## CDrilldownNext

A button to navigate to the next level in the drilldown.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

## CDrilldownBack

A button to navigate back in the drilldown.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

## CDropdown

A dropdown component.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the dropdown. If not provided, one will be generated. |
| `options` | `DropdownOptions` | - | Configuration options for the dropdown instance. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Dropdown>` | Emitted when the dropdown instance is initialized. |
| `opened` | `CustomEvent<Dropdown>` | Emitted when the dropdown opens. |
| `closed` | `CustomEvent<Dropdown>` | Emitted when the dropdown closes. |
| `destroy` | `CustomEvent<Dropdown>` | Emitted when the dropdown instance is destroyed. |

### Exposed

The component exposes the underlying `dropdown` instance.

## CDropdownMenu

The container for the dropdown content.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `id` | `string` | - | The unique identifier for the menu. |

## CDropdownTrigger

The button to toggle the dropdown.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'button'` | The HTML tag or component to render. |

Automatically links with the `CDropdownMenu` via context or ID.

## CMarquee

A scrolling marquee component.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | The HTML tag or component to render. |
| `containerAs` | `string \| Component` | `'ul'` | The HTML tag or component for the inner container. |
| `options` | `MarqueeOptions` | - | Configuration options for the marquee instance. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| `init` | `CustomEvent<Marquee>` | Emitted when the marquee instance is initialized. |
| `play` | `CustomEvent<Marquee>` | Emitted when the marquee starts playing. |
| `pause` | `CustomEvent<Marquee>` | Emitted when the marquee pauses. |
| `loop` | `CustomEvent<Marquee>` | Emitted when the marquee completes a loop. |
| `destroy` | `CustomEvent<Marquee>` | Emitted when the marquee instance is destroyed. |

### Exposed

The component exposes the underlying `marquee` instance.
