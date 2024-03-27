<script setup lang="ts">
import { useCollapse } from '@compotes/vue'
import { shallowRef } from 'vue'
import 'compotes/css/collapse'

const collapseEl = shallowRef<null | HTMLElement>(null)
useCollapse(collapseEl)
</script>

<template>
  <button class="c-collapse-trigger" aria-controls="my-collapse">
    Trigger collapse
  </button>
  <div id="my-collapse" ref="collapseEl" class="c-collapse">
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
      Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus.
    </p>
  </div>
</template>
