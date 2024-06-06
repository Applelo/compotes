<script setup lang="ts">
import { useCollapse } from '@compotes/vue'
import { computed, ref, shallowRef } from 'vue'
import 'compotes/css/collapse'

const collapseEl = shallowRef<null | HTMLElement>(null)
const show = ref<boolean>(false)
useCollapse(collapseEl, {
  on: {
    shown: () => {
      show.value = true
    },
    hidden: () => {
      show.value = false
    },
  },
})

const isExpanded = computed(() => show.value ? 'Expanded' : 'Hidden')
</script>

<template>
  <div>
    <button class="c-collapse-trigger" aria-controls="my-collapse">
      Trigger collapse
    </button>
    <div id="my-collapse" ref="collapseEl" class="c-collapse">
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus.
      </p>
    </div>
  </div>
  <div style="position: absolute; top: 0; left: 0;">
    Status: {{ isExpanded }}
  </div>
</template>
