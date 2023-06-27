---
prev: false
---

# Collapse Demo

<script setup>
  import './../../packages/core/dist/css/collapse.css'
  import { Collapse } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {

    const collapses = document.querySelectorAll('.c-collapse')
    collapses.forEach((el) => {
      const collapse = new Collapse(el)
    })
  })
</script>
<style>
  .c-collapse-trigger {
    color: var(--vp-c-brand);
  }
</style>
<div style="margin-top: 2rem;">
  <button class="c-collapse-trigger" aria-controls="accordion-1">
    Accordion 1
  </button>
  <div class="c-collapse c-collapse--show" id="accordion-1" style="transition: height .2s;">
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
    </p>
  </div>
</div>
<div style="margin-top: 1rem;">
  <button class="c-collapse-trigger" aria-controls="accordion-2">
    Accordion 2
  </button>
  <div class="c-collapse" id="accordion-2" style="transition: height .2s;">
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
    </p>
  </div>
</div>
