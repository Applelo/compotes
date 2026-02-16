---
prev: false
---

# Collapse Demo

<script setup>
  import './../../packages/core/dist/css/collapse.css'
  import { CCollapse, CCollapseTrigger } from './../../packages/vue'
</script>
<style>
  .c-collapse-trigger {
    color: var(--vp-c-brand);
  }
</style>
<div style="margin-top: 2rem;">
  <CCollapseTrigger aria-controls="accordion-1">
    Accordion 1
  </CCollapseTrigger>
  <CCollapse id="accordion-1" default-open style="transition: height .2s;">
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
    </p>
  </CCollapse>
</div>
<div style="margin-top: 1rem;">
  <CCollapseTrigger aria-controls="accordion-2">
    Accordion 2
  </CCollapseTrigger>
  <CCollapse id="accordion-2" style="transition: height .2s;">
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
    </p>
  </CCollapse>
</div>
